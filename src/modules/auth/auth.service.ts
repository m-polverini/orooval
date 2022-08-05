import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.removeExpiredRefreshTokenCron();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByIdOrEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      this.logger.debug(`The credentials entered are incorrect`);
      throw new UnauthorizedException(`The credentials entered are incorrect`);
    }
    const { password, refreshToken, tokenData, ...result } = user;
    this.logger.debug(`User found, login process is almost concluded`);
    return result;
  }

  login(user: User) {
    this.logger.debug(`Do refresh token sign process`);
    const signedAt = new Date();
    const refreshToken = this.signRefreshToken(user, signedAt);
    this.userService.updateRefreshToken(user.id, refreshToken, signedAt);
    return refreshToken;
  }

  signRefreshToken(user: User, signedAt: Date) {
    const payload = {
      email: user.email,
      sub: user.id,
      displayName: user.displayName,
      name: user.name,
      surname: user.surname,
      birthData: user.birthData,
      refresh: true,
      signedAt: signedAt.toISOString(),
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
  }

  signAccessToken(user: User) {
    this.logger.debug(`Do jwt sign process`);
    const payload = {
      email: user.email,
      sub: user.id,
      displayName: user.displayName,
      name: user.name,
      surname: user.surname,
      birthData: user.birthData,
    };
    return `Bearer ${this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES,
    })}`;
  }

  getExpiresRefreshToken() {
    const now = new Date();
    const time = now.getTime();
    const timeToAdd = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES);
    const expiresTime = time + timeToAdd;
    now.setTime(expiresTime);
    return now;
  }

  async validateRefreshToken(id: string, token: string) {
    this.logger.debug(`Init validate refresh token user process`);
    const userExist = await this.userService.findByIdOrEmail(id);
    if (!userExist) {
      this.logger.debug(
        `Can't continue with the update user process, user not exist`,
      );
      throw new BadRequestException(`User not exist`);
    }
    this.logger.debug(`Validate refresh token user process concluded`);
    if (!(await bcrypt.compare(token, userExist.refreshToken)))
      throw new UnauthorizedException(
        `You aren't authorized to access the resources, please login`,
      );
    return userExist;
  }

  removeExpiredRefreshTokenCron() {
    const job = new CronJob(process.env.CRON_REMOVE_REFRESH_TOKEN, async () => {
      let users = await this.userService.findAllWithRefreshToken();
      users = users.filter((user) =>
        this.isRefreshTokenInvalid(user.tokenData),
      );
      if (users) {
        users.forEach((user) => this.userService.removeRefreshToken(user));
      }
    });

    this.schedulerRegistry.addCronJob('removeRefreshTokenExpiredFromUser', job);
    job.start();
  }

  isRefreshTokenInvalid(tokenData: Date) {
    const timeToAdd = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES);
    const time = tokenData.getTime() + timeToAdd;
    const date = moment(time);
    return date.isBefore(moment());
  }
}

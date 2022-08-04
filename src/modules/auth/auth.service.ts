import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByIdOrEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      this.logger.debug(`The credentials entered are incorrect`);
      throw new UnauthorizedException(`The credentials entered are incorrect`);
    }
    const { password, ...result } = user;
    this.logger.debug(`User found, login process is almost concluded`);
    return result;
  }

  login(user: any) {
    this.logger.debug(`Do jwt sign process`);
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      user: user,
    };
  }
}

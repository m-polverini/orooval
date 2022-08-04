import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.debug(`Init create user process`);
    const userExist = await this.findByIdOrEmail(createUserDto.email);
    if (userExist) {
      this.logger.debug(
        `Can't continue with the create user process, user already exist with the same email`,
      );
      throw new BadRequestException(`User already exist with this email`);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hash;
    const user = this.userRepo.save(new User(createUserDto));
    this.logger.debug(`Create user process concluded`);
    return user;
  }

  async findByIdOrEmail(idOrEmail: string): Promise<User> {
    this.logger.debug(`Init search user process`);
    let user: Promise<User>;
    if (
      idOrEmail &&
      idOrEmail.match(
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
      )
    ) {
      this.logger.debug(`Do search user process by id`);
      user = this.userRepo.findOneBy({ id: idOrEmail });
    } else {
      this.logger.debug(`Do search user process by email`);
      user = this.userRepo.findOneBy({ email: idOrEmail });
    }
    this.logger.debug(`Search user process concluded`);
    return user;
  }

  async update(idOrEmail: string, updateUserDto: UpdateUserDto) {
    this.logger.debug(`Init update user process`);
    const userExist = await this.findByIdOrEmail(idOrEmail);
    if (!userExist) {
      this.logger.debug(
        `Can't continue with the update user process, user not exist`,
      );
      throw new BadRequestException(`Utente non esistente`);
    }
    const user = this.userRepo.save(
      this.cleanUpdateDto({ ...userExist, ...updateUserDto }),
    );
    this.logger.debug(`Update user process concluded`);
    return user;
  }

  async remove(idOrEmail: string) {
    this.logger.debug(`Init delete user process`);
    const userExist = await this.findByIdOrEmail(idOrEmail);
    if (!userExist) {
      this.logger.debug(
        `Can't continue with the delete user process, user not exist`,
      );
      throw new BadRequestException(`Utente non esistente`);
    }
    this.userRepo.delete({ id: userExist.id });
    this.logger.debug(`Delete user process concluded`);
  }

  private cleanUpdateDto(user: User) {
    if (!user.birthData) user.birthData = null;
    if (!user.displayName) user.displayName = null;
    if (!user.name) user.name = null;
    if (!user.surname) user.surname = null;
    return new User(user);
  }
}

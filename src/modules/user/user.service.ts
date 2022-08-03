import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hash;
    const user = new User(createUserDto);
    return this.userRepo.save(user);
  }

  async findOne(email: string): Promise<any> {
    return this.userRepo.findOneBy({ email });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

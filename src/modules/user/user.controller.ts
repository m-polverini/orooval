import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':idOrEmail')
  findOne(@Param('idOrEmail') idOrEmail: string, @Req() req: Request) {
    console.log(req.signedCookies);
    return this.userService.findByIdOrEmail(idOrEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':idOrEmail')
  update(
    @Param('idOrEmail') idOrEmail: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(idOrEmail, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':idOrEmail')
  remove(@Param('idOrEmail') idOrEmail: string) {
    return this.userService.remove(idOrEmail);
  }
}

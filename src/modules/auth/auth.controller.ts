import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const result = this.authService.login(req.user);
    console.log(req.signedCookies);
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      signed: true,
    });
    return result;
  }
}

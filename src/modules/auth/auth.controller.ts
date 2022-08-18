import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    response.setHeader(
      'Authorization',
      `Bearer ${this.authService.signAccessToken(req.user)}`,
    );
    response.cookie('refresh_token', this.authService.login(req.user), {
      signed: true,
      httpOnly: true,
      secure: true,
      expires: this.authService.getExpiresRefreshToken(),
    });
    return req.user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.signedCookies.refresh_token;
    const user = await this.authService.validateRefreshToken(
      req.user.id,
      refreshToken,
    );
    response.cookie('refresh_token', this.authService.login(user), {
      signed: true,
      httpOnly: true,
      secure: true,
      expires: this.authService.getExpiresRefreshToken(),
    });
    return { user, access_token: this.authService.signAccessToken(user) };
  }
}

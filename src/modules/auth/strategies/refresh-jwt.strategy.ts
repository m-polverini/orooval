import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.signedCookies) {
            return req.signedCookies.refresh_token;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
      id: payload.sub,
      displayName: payload.displayName,
      name: payload.name,
      surname: payload.surname,
      birthData: payload.birthData,
      refresh: payload.refresh,
      signedAt: payload.signedAt,
    };
  }
}

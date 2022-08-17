import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IncomingMessage } from 'http';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug(`Init login process`);
    const request: Request = context.switchToHttp().getRequest();
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (info) {
      this.logger.debug(`Info login process: ${info}`);
      throw new UnauthorizedException(`Please enter your email and password`);
    }

    if (err || !user) {
      this.logger.error(`Catched error in login process: ${err}`);
      throw (
        err ||
        new UnauthorizedException(`The credentials entered are incorrect`)
      );
    }

    if (user) {
      if (user.isBanned)
        throw new UnauthorizedException('The account is blocked');
      if (!user.isActive)
        throw new UnauthorizedException('The account must be activated');
    }

    this.logger.debug(`Login process concluded`);
    return user;
  }
}

import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {
  private readonly logger = new Logger(RefreshJwtAuthGuard.name);

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (info) {
      this.logger.debug(`Info refresh token process: ${info}`);
      this.throwUnauthorizedException();
    }

    if (err || !user) {
      this.logger.error(`Catched error in refresh token process: ${err}`);
      this.throwUnauthorizedException(err);
    }

    return user;
  }

  throwUnauthorizedException(err?: any) {
    throw (
      err ||
      new UnauthorizedException(
        `You aren't authorized to access the resources, please login`,
      )
    );
  }
}

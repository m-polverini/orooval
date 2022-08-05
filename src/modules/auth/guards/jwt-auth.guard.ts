import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (info || err || !user) {
      this.logger.error(
        `Catched error in jwt validate process; info: ${info}; err: ${err}`,
      );
      throw (
        err ||
        new UnauthorizedException(
          `You aren't authorized to access the resources, please login`,
        )
      );
    }

    return user;
  }
}

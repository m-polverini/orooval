import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ServerResponse } from 'http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpResponse } from '../models/http-response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<any, HttpResponse> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse> {
    return next.handle().pipe(
      map((val) => {
        const response: ServerResponse = context.switchToHttp().getResponse();
        // response.setHeader('Access-Control-Allow-Origin', '*');
        // response.setHeader('Access-Control-Expose-Headers', '*');
        // response.setHeader('Access-Control-Allow-Methods', '*');
        // response.setHeader('Access-Control-Allow-Headers', '*');
        if (val instanceof HttpResponse) return val;
        return new HttpResponse(
          response.statusCode,
          new Date().toISOString(),
          val,
        );
      }),
    );
  }
}

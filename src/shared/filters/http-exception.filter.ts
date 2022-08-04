import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from '../models/http-response';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter<HttpException> {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 400;

    response
      .status(status)
      .json(
        new HttpResponse(
          status,
          new Date().toISOString(),
          undefined,
          exception.message,
        ),
      );
  }
}

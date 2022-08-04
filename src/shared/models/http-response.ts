import { HttpException } from '@nestjs/common';

export class HttpResponse {
  private statusCode: number;
  private timestamp: string;
  private response?: any;
  private error?: string;

  constructor(
    statusCode: number,
    timestamp: string,
    response?: any,
    error?: string,
  ) {
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.response = response;
    this.error = error;
  }
}

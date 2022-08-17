import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();

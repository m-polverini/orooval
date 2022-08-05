import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FunctionsModule } from './modules/functions/functions.module';
import { BannersModule } from './modules/banners/banners.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LocalesModule } from './modules/locales/locales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Locale } from './modules/locales/entities/locale.entity';
import { User } from './modules/user/entities/user.entity';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      installExtensions: true,
      applicationName: 'oroovalPg',
      connectTimeoutMS: 30000,
      entities: [Locale, User],
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
    }),
    CacheModule.register({
      ttl: 5,
      max: 10,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    FunctionsModule,
    BannersModule,
    ReviewsModule,
    LocalesModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

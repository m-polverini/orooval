import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FunctionsModule } from './modules/functions/functions.module';
import { BannersModule } from './modules/banners/banners.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LocalesModule } from './modules/locales/locales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locale } from './modules/locales/entities/locale.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url:
        process.env.DATABASE_URL ||
        'postgres://jdcjfhnrpoyixs:af47cee3b30e14c0f92ad63ff0527c547b99a9d3dd3c294f181398ab2e592f0b@ec2-54-170-90-26.eu-west-1.compute.amazonaws.com:5432/d57cn4br94sic7',
      type: 'postgres',
      installExtensions: true,
      applicationName: 'oroovalPg',
      connectTimeoutMS: 30000,
      entities: [Locale],
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
    }),
    FunctionsModule,
    BannersModule,
    ReviewsModule,
    LocalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

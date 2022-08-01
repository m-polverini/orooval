import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FunctionsModule } from './modules/functions/functions.module';
import { BannersModule } from './modules/banners/banners.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LocalesModule } from './modules/locales/locales.module';

@Module({
  imports: [FunctionsModule, BannersModule, ReviewsModule, LocalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

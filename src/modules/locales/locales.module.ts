import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesController } from './locales.controller';
import { Locale } from './entities/locale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locale])],
  controllers: [LocalesController],
  providers: [LocalesService],
})
export class LocalesModule {}

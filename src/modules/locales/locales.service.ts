import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { Locale } from './entities/locale.entity';

@Injectable()
export class LocalesService {
  private readonly logger = new Logger(LocalesService.name);

  constructor(
    @InjectRepository(Locale) private localeRepo: Repository<Locale>,
  ) {}

  create(createLocaleDto: CreateLocaleDto) {
    return 'This action adds a new locale';
  }

  findAll() {
    this.logger.log(`Extract all locales`);
    return this.localeRepo.find();
  }

  findOne(id: number) {
    this.logger.log(`Extract locale with ID: ${id}`);
    return this.localeRepo.findOneBy({ id });
  }

  update(id: number, updateLocaleDto: UpdateLocaleDto) {
    return `This action updates a #${id} locale`;
  }

  remove(id: number) {
    return this.localeRepo.delete(id);
  }
}

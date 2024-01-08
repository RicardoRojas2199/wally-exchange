import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyInMemoryDB } from './in-memory-db';

@Module({
  imports: [CurrencyInMemoryDB],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}

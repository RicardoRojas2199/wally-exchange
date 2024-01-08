import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [InMemoryDBModule.forFeature('currency')],
  exports: [InMemoryDBModule],
})
export class CurrencyInMemoryDB {}

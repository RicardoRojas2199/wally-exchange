import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface ExchangeRateEntity extends InMemoryDBEntity {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

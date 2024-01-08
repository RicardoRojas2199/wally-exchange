// @import Nest Dependencies
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
// @import Entities
import { ExchangeRateEntity } from './entities/exchange-rate.entity';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(
    private readonly inMemoryExchangeRateDB: InMemoryDBService<ExchangeRateEntity>,
  ) {}

  onModuleInit() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const initialExchangeRates: Omit<ExchangeRateEntity, 'id'>[] = [
      { fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.91 },
      { fromCurrency: 'EUR', toCurrency: 'USD', rate: 1.1 },
      { fromCurrency: 'PEN', toCurrency: 'USD', rate: 0.27 },
      { fromCurrency: 'USD', toCurrency: 'PEN', rate: 3.7 },
    ];

    initialExchangeRates.forEach((exchangeRateData) =>
      this.inMemoryExchangeRateDB.create(exchangeRateData),
    );
  }

  getAllExchangeRates() {
    return this.inMemoryExchangeRateDB.getAll();
  }

  setExchangeRate(fromCurrency: string, toCurrency: string, rate: number) {
    const exchangeRate = this.inMemoryExchangeRateDB.query(
      (data) =>
        data.fromCurrency === fromCurrency && data.toCurrency === toCurrency,
    );

    if (!exchangeRate?.length) {
      this.inMemoryExchangeRateDB.create({ fromCurrency, rate, toCurrency });
    } else {
      this.inMemoryExchangeRateDB.update({
        id: exchangeRate[0].id,
        fromCurrency,
        toCurrency,
        rate,
      });
    }
    return 'Exchange rate set successfully';
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    const exchangeRate = this.inMemoryExchangeRateDB.query(
      (data) =>
        data.fromCurrency === fromCurrency && data.toCurrency === toCurrency,
    );

    if (!exchangeRate?.length) {
      throw new NotFoundException(
        'Exchange rate not found for these currencies',
      );
    }

    return exchangeRate[0].rate;
  }

  calculateExchange(amount: number, fromCurrency: string, toCurrency: string) {
    const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency);

    const exchangedAmount = amount * exchangeRate;

    return {
      originalAmount: amount,
      exchangedAmount,
      fromCurrency,
      toCurrency,
      rate: exchangeRate,
    };
  }
}

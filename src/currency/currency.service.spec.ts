import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ExchangeRateEntity } from './entities/exchange-rate.entity';
import { NotFoundException } from '@nestjs/common';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let inMemoryExchangeRateDB: InMemoryDBService<ExchangeRateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: InMemoryDBService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    inMemoryExchangeRateDB =
      module.get<InMemoryDBService<ExchangeRateEntity>>(InMemoryDBService);
  });

  it('should return all exchange rates', async () => {
    const exchangeRates: ExchangeRateEntity[] = [
      {
        id: 'test',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        rate: 0.91,
      } as ExchangeRateEntity,
    ];
    const getAllSpy = jest
      .spyOn(service['inMemoryExchangeRateDB'], 'getAll')
      .mockReturnValue(exchangeRates);

    expect(service.getAllExchangeRates()).toBe(exchangeRates);
    expect(getAllSpy).toHaveBeenCalled();
  });
  it('should get exchange rate', async () => {
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    const exchangeRate: ExchangeRateEntity[] = [
      { id: 'test', fromCurrency, toCurrency, rate: 0.91 },
    ];
    const getExchangeRateSpy = jest
      .spyOn(inMemoryExchangeRateDB, 'query')
      .mockReturnValue(exchangeRate);

    const result = service.getExchangeRate(fromCurrency, toCurrency);

    expect(result).toBe(0.91);
    expect(getExchangeRateSpy).toHaveBeenCalled();
  });

  it('should throw NotFoundException when exchange rate not found', async () => {
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    const getExchangeRateSpy = jest
      .spyOn(inMemoryExchangeRateDB, 'query')
      .mockReturnValue([]);

    try {
      service.getExchangeRate(fromCurrency, toCurrency);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(
        'Exchange rate not found for these currencies',
      );
    }
    expect(getExchangeRateSpy).toHaveBeenCalled();
  });

  it('should calculate exchange', async () => {
    const amount = 100;
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    const exchangeRate = 0.91;

    const getExchangeRateSpy = jest
      .spyOn(service, 'getExchangeRate')
      .mockReturnValue(exchangeRate);

    const result = service.calculateExchange(amount, fromCurrency, toCurrency);

    expect(getExchangeRateSpy).toHaveBeenCalled();
    expect(result).toEqual({
      originalAmount: amount,
      exchangedAmount: amount * exchangeRate,
      fromCurrency,
      toCurrency,
      rate: exchangeRate,
    });
  });
});

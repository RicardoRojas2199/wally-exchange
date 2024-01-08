import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

class MockJwtGuard {
  canActivate = jest.fn().mockReturnValue(true);
}
describe('CurrencyController', () => {
  let controller: CurrencyController;
  let service: CurrencyService;

  beforeEach(async () => {
    const inMemoryDBServiceProvider = {
      provide: InMemoryDBService,
      useValue: {
        getAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        query: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        CurrencyService,
        inMemoryDBServiceProvider,
        {
          provide: 'JwtGuardGuard',
          useClass: MockJwtGuard,
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should return all exchange rates', async () => {
    const exchangeRates = [
      { id: 'testing', fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.91 },
    ];
    jest.spyOn(service, 'getAllExchangeRates').mockReturnValue(exchangeRates);

    expect(controller.getAllExchangeRates()).toBe(exchangeRates);
  });

  it('should calculate exchange', async () => {
    const exchangeData = {
      originalAmount: 100,
      exchangedAmount: 91,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0.91,
    };
    const inputData = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    jest.spyOn(service, 'calculateExchange').mockReturnValue(exchangeData);

    expect(controller.calculateExchange(inputData)).toBe(exchangeData);
  });

  it('should set exchange rate', async () => {
    const inputData = {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0.91,
    };
    jest
      .spyOn(service, 'setExchangeRate')
      .mockReturnValue('Exchange rate set successfully');

    expect(controller.setExchangeRate(inputData)).toBe(
      'Exchange rate set successfully',
    );
  });
});

// @import Nest Dependencies
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// @import Service
import { CurrencyService } from './currency.service';
// @import DTOs
import { CalculateExchangeDto } from './dto/calculate-exchange.dto';
import { SetExchangeRateDto } from './dto/set-exchange-rate.dto';
// @import Swagger Schemas
import {
  ExchangeRatesResponseSchema,
  CalculateExchangeResponseSchema,
} from './schemas';
import { JwtGuardGuard } from '../auth/jwt.guard';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currenyService: CurrencyService) {}

  @Get('exchange-rates')
  @UseGuards(JwtGuardGuard)
  @ApiOperation({ summary: 'Get all exchange rates' })
  @ApiResponse({
    status: 200,
    description: 'Returns all exchange rates',
    schema: ExchangeRatesResponseSchema,
  })
  getAllExchangeRates() {
    return this.currenyService.getAllExchangeRates();
  }

  @Post('calculate-exchange')
  @UseGuards(JwtGuardGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Calculate exchange' })
  @ApiResponse({
    status: 200,
    description: 'Returns calculated exchange data',
    schema: CalculateExchangeResponseSchema,
  })
  calculateExchange(@Body() calculateExchangeDto: CalculateExchangeDto) {
    const exchangeData = this.currenyService.calculateExchange(
      calculateExchangeDto.amount,
      calculateExchangeDto.fromCurrency,
      calculateExchangeDto.toCurrency,
    );
    return exchangeData;
  }

  @Post('set-exchange-rate')
  @UseGuards(JwtGuardGuard)
  @ApiOperation({ summary: 'Set exchange rate' })
  @ApiResponse({ status: 201, description: 'Exchange rate set successfully' })
  setExchangeRate(@Body() setExchangeRateDto: SetExchangeRateDto) {
    return this.currenyService.setExchangeRate(
      setExchangeRateDto.fromCurrency,
      setExchangeRateDto.toCurrency,
      setExchangeRateDto.rate,
    );
  }
}

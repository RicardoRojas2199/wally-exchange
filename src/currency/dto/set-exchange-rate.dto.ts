import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SetExchangeRateDto {
  @ApiProperty({ example: 'USD', description: 'Currency to convert from' })
  @IsString()
  fromCurrency: string;

  @ApiProperty({ example: 'PEN', description: 'Currency to convert to' })
  @IsString()
  toCurrency: string;

  @ApiProperty({ example: 0.91, description: 'Exchange rate' })
  @IsNumber()
  rate: number;
}

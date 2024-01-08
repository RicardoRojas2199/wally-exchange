import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CalculateExchangeDto {
  @ApiProperty({ example: 100, description: 'Amount to be exchanged' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD', description: 'Currency to convert from' })
  @IsString()
  fromCurrency: string;

  @ApiProperty({ example: 'PEN', description: 'Currency to convert to' })
  @IsString()
  toCurrency: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'The username of the user (min length: 3, max length: 20)',
    minLength: 3,
    maxLength: 20,
  })
  username: string;

  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'The password of the user (min length: 3, max length: 20)',
    minLength: 3,
    maxLength: 20,
  })
  password: string;
}

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Registers a new user',
    type: RegisterDto,
  })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConflictResponse({
    status: 409,
    description: 'User with that username already exists',
  })
  register(@Body() registerBody: RegisterDto) {
    return this.authService.register(registerBody);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Logs in a user and returns the authentication token',
    type: LoginDto,
  })
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Password Incorrect',
  })
  login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }
}

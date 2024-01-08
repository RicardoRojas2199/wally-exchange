import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService, InMemoryDBService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    const registerBody: RegisterDto = {
      username: 'newUser',
      password: 'password123',
    };
    const mockUser = { id: '1', username: 'newUser', password: 'password123' };
    jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

    const registerResponse = await controller.register(registerBody);

    expect(registerResponse).toBe(mockUser);
    expect(authService.register).toHaveBeenCalledWith(registerBody);
  });
  it('should throw ConflictException on register when user already exists', async () => {
    const registerBody: RegisterDto = {
      username: 'existingUser',
      password: 'password123',
    };
    jest
      .spyOn(authService, 'register')
      .mockRejectedValue(new ConflictException());

    await expect(controller.register(registerBody)).rejects.toThrow(
      ConflictException,
    );
    expect(authService.register).toHaveBeenCalledWith(registerBody);
  });

  it('should login an existing user', async () => {
    const loginBody: LoginDto = {
      username: 'existingUser',
      password: 'password123',
    };

    const mockUser = {
      token: 'mockToken',
      user: {
        id: '1',
        username: 'existingUser',
      },
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockUser);

    const loginResponse = await controller.login(loginBody);

    expect(loginResponse).toBe(mockUser);
    expect(authService.login).toHaveBeenCalledWith(loginBody);
  });
  it('should throw NotFoundException on login when user not found', async () => {
    const loginBody: LoginDto = {
      username: 'nonexistentUser',
      password: 'password123',
    };
    jest.spyOn(authService, 'login').mockRejectedValue(new NotFoundException());

    await expect(controller.login(loginBody)).rejects.toThrow(
      NotFoundException,
    );
    expect(authService.login).toHaveBeenCalledWith(loginBody);
  });
});

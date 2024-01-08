import { ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from 'src/users/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
            findOneByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should validate user by ID', async () => {
    const userId = 'userId';
    const user = { id: userId, username: 'test', password: 'hashedpassword' };
    jest.spyOn(usersService, 'findOneById').mockReturnValue(user);

    const result = await authService.validateUser(userId);
    expect(result).toEqual({ id: userId, username: 'test' });
  });

  it('should throw NotFoundException on login when user not found', async () => {
    const loginBody: LoginDto = { username: 'nonexistent', password: 'pass' };
    jest.spyOn(usersService, 'findOneByUsername').mockReturnValue(null);

    await expect(authService.login(loginBody)).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should login successfully', async () => {
    const loginBody: LoginDto = {
      username: 'existingUser',
      password: 'password',
    };
    const mockUser: UserEntity = {
      id: '1',
      username: 'existingUser',
      password: 'hashedPassword',
    };
    jest.spyOn(usersService, 'findOneByUsername').mockReturnValue(mockUser);
    jest.spyOn(authService, 'login').mockResolvedValueOnce({
      token: 'mockToken',
      user: { id: mockUser.id, username: mockUser.username },
    });

    const loginResult = await authService.login(loginBody);

    expect(loginResult.token).toBeDefined();
    expect(loginResult.user).toEqual({
      id: mockUser.id,
      username: mockUser.username,
    });
  });

  it('should register a new user successfully', async () => {
    const registerBody: RegisterDto = {
      username: 'newUser',
      password: 'password',
    };
    const mockUser: Partial<UserEntity> = {
      id: '2',
      username: registerBody.username,
      password: 'hashedPassword',
    };
    jest.spyOn(usersService, 'findOneByUsername').mockReturnValue(null);
    jest
      .spyOn(authService, 'register')
      .mockResolvedValueOnce(mockUser as UserEntity);

    const registerResult = await authService.register(registerBody);

    expect(registerResult.id).toBeDefined();
    expect(registerResult.username).toBe(registerBody.username);
  });

  it('should throw ConflictException on register when user already exists', async () => {
    const existingUser: UserEntity = {
      id: 'existingUserId',
      username: 'existingUser',
      password: 'existingPassword',
    };
    jest.spyOn(usersService, 'findOneByUsername').mockReturnValue(existingUser);

    const registerBody: RegisterDto = {
      username: 'existingUser',
      password: 'password',
    };

    await expect(authService.register(registerBody)).rejects.toThrow(
      ConflictException,
    );
  });
});

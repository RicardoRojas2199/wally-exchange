import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { compareHash, generateHash } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: string) {
    const user = this.usersService.findOneById(id);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginBody: LoginDto) {
    const foundUser = this.usersService.findOneByUsername(loginBody.username);
    if (!foundUser) throw new NotFoundException('User not found');
    const isPasswordValid = await compareHash(
      loginBody.password,
      foundUser.password,
    );
    if (!isPasswordValid) throw new ConflictException('Password Incorrect');

    const userData = {
      id: foundUser.id,
      username: foundUser.username,
    };
    const token = this.jwtService.sign(userData);

    const data = {
      token,
      user: userData,
    };
    return data;
  }

  async register(registerBody: RegisterDto) {
    const foundUser = this.usersService.findOneByUsername(
      registerBody.username,
    );
    if (foundUser) {
      throw new ConflictException('User with that username already exists');
    }

    const userParse = {
      ...registerBody,
      password: await generateHash(registerBody.password),
    };

    const newUser = this.usersService.createUser(userParse);

    return newUser;
  }
}

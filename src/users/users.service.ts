import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly inMemoryUserDB: InMemoryDBService<UserEntity>) {}

  seedDatabase() {
    const initialUsers: Omit<UserEntity, 'id'>[] = [
      {
        username: 'test1',
        password:
          '$2a$10$N44YS3EPEEVXd2eWN5CNXu0xo4E0KHUg9KHr/Apr8xd7pIpyQmMFa',
      },
      {
        username: 'test',
        password:
          '$2a$10$/1u3/pdqGlrwMjmPsps/peO2TuSSvP/ZX8b9tyLlD7cM8XjMBxz16',
      },
    ];

    initialUsers.forEach((initialUserData) =>
      this.inMemoryUserDB.create(initialUserData),
    );
  }

  createUser(userData: Partial<UserEntity>) {
    const newUser = this.inMemoryUserDB.create(userData);
    return { id: newUser.id, username: newUser.username };
  }

  findOneByUsername(username: string) {
    const foundUser = this.inMemoryUserDB.query(
      (data) => data.username === username,
    );
    if (foundUser.length > 0) {
      return foundUser[0];
    }
    return null;
  }

  findOneById(id: string) {
    const foundUser = this.inMemoryUserDB.query((data) => data.id === id);
    if (foundUser.length > 0) {
      return foundUser[0];
    }
    return null;
  }
}

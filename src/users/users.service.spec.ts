import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { Test } from '@nestjs/testing';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

class MockInMemoryDBService {
  private readonly data: UserEntity[] = [];

  create(record: UserEntity): UserEntity {
    this.data.push(record);
    return record;
  }

  query(filterFn: (data: UserEntity) => boolean): UserEntity[] {
    return this.data.filter(filterFn);
  }
}

describe('UserService', () => {
  let service: UsersService;
  let inMemoryUserDB: MockInMemoryDBService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: InMemoryDBService,
          useClass: MockInMemoryDBService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    inMemoryUserDB = module.get<MockInMemoryDBService>(InMemoryDBService);
  });

  it('should create a new user', async () => {
    const newUser: UserEntity = {
      id: '3',
      username: 'user3',
      password: 'pass3',
    };
    const createSpy = jest
      .spyOn(inMemoryUserDB, 'create')
      .mockReturnValue(newUser);

    expect(service.createUser(newUser)).toBe(newUser);
    expect(createSpy).toHaveBeenCalledWith(newUser);
  });

  it('should find user by username', async () => {
    const username = 'user1';
    const users: UserEntity[] = [
      { id: '1', username: 'user1', password: 'pass1' },
      { id: '2', username: 'user2', password: 'pass2' },
    ];

    const querySpy = jest
      .spyOn(inMemoryUserDB, 'query')
      .mockReturnValue(users.filter((user) => user.username === username));

    expect(service.findOneByUsername(username)).toEqual(users[0]);
    expect(querySpy).toHaveBeenCalled();
  });

  it('should find user by id', async () => {
    const userId = '2';
    const users: UserEntity[] = [
      { id: '1', username: 'user1', password: 'pass1' },
      { id: '2', username: 'user2', password: 'pass2' },
    ];

    const querySpy = jest
      .spyOn(inMemoryUserDB, 'query')
      .mockReturnValue(users.filter((user) => user.id === userId));

    expect(service.findOneById(userId)).toEqual(users[1]);
    expect(querySpy).toHaveBeenCalled();
  });
});

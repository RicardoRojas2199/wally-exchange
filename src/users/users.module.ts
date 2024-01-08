import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInMemoryDB } from './in-memory-db';

@Module({
  imports: [UserInMemoryDB],
  providers: [UsersService],
})
export class UsersModule {}

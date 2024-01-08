import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [InMemoryDBModule.forFeature('user')],
  exports: [InMemoryDBModule],
})
export class UserInMemoryDB {}

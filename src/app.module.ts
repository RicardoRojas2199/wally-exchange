import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currency/currency.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, CurrencyModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

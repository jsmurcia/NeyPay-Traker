import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { PaysModule } from './pays/pays.module';
import { Pay } from './pays/entities/pay.entity';
import { PaymentMessageModule } from './payment-message/payment-message.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'netpaytracker',
      entities: [User, Pay],
      synchronize: true, // Solo para desarrollo; en producción usa migrations
    }),
    PaysModule,
    PaymentMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

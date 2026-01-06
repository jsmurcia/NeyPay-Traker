import { Module } from '@nestjs/common';
import { PaysService } from './pays.service';
import { PaysController } from './pays.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from './entities/pay.entity';
import { PaymentMessageModule } from '../payment-message/payment-message.module';

@Module({
  controllers: [PaysController],
  providers: [PaysService],
  imports: [TypeOrmModule.forFeature([Pay]), PaymentMessageModule],
})
export class PaysModule {}

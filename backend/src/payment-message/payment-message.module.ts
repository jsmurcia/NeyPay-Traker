import { Module } from '@nestjs/common';
import { PaymentMessageService } from './payment-message.service';
import { PaymentMessageGateway } from './payment-message.gateway';

@Module({
  providers: [PaymentMessageGateway, PaymentMessageService],
  exports: [PaymentMessageGateway],
})
export class PaymentMessageModule {}

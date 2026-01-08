import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePayDto } from './dto/create-pay.dto';
import { UpdatePayDto } from './dto/update-pay.dto';
import { Pay } from './entities/pay.entity';
import { PaymentMessageGateway } from '../payment-message/payment-message.gateway';

@Injectable()
export class PaysService {
  constructor(
    @InjectRepository(Pay)
    private readonly payRepository: Repository<Pay>,
    private readonly paymentGateway: PaymentMessageGateway,
  ) {}

  async create(createPayDto: CreatePayDto) {
    try {
      // Si no viene fecha, asignar la actual
      const payData = {
        ...createPayDto,
        date: new Date().toISOString(),
      };
      
      const transaction = this.payRepository.create(payData);
      const saved = await this.payRepository.save(transaction);
      
      // Emitir evento por WebSocket
      this.paymentGateway.wss.emit('pay_created', saved);
      
      return saved;
    } catch (error) {
      throw new InternalServerErrorException('Error creating pay record');
    }
  }

  findAll() {
    return this.payRepository.find();
  }

  findOne(id: string) {
    return this.payRepository.findOneBy({ id });
  }

  update(id: string, updatePayDto: UpdatePayDto) {
    return this.payRepository.update(id, updatePayDto);
  }

  remove(id: string) {
    return this.payRepository.delete(id);
  }
}

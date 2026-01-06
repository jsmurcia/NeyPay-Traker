import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PaymentMessageService } from './payment-message.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PaymentMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly paymentMessageService: PaymentMessageService) {}

  handleConnection(client: Socket) {
    this.paymentMessageService.registerClient(client);

    this.wss.emit(
      'clients-updated',
      this.paymentMessageService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.paymentMessageService.removeClient(client);

    this.wss.emit(
      'clients-updated',
      this.paymentMessageService.getConnectedClients(),
    );
  }
}

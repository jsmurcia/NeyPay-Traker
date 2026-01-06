import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [clientId: string]: Socket;
}

@Injectable()
export class PaymentMessageService {
  private connectedClients: ConnectedClients = {};

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
    console.log(`Client connected: ${client.id}`);
    console.log(`Total clients: ${Object.keys(this.connectedClients).length}`);
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
    console.log(`Client disconnected: ${client.id}`);
    console.log(`Total clients: ${Object.keys(this.connectedClients).length}`);
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}

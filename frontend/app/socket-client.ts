import { Manager, Socket } from "socket.io-client";

export interface Pay {
  id: string;
  message: string;
  date: string;
  origin: string;
}

// Función para extraer el monto del mensaje
export const extractAmountFromMessage = (message: string, origin: string): number => {
  if (origin === 'daviplata') {
    // Buscar patrón: $XX,XXX o $XX.XXX
    const match = message.match(/\$(\d{1,3}(?:[.,]\d{3})*)/);  
    if (match) {
      return parseInt(match[1].replace(/[.,]/g, ''));
    }
  } else if (origin === 'nequi') {
    // Buscar todos los dígitos consecutivos después de "envió"
    const match = message.match(/envió\s+([\d.,]+)/);
    if (match) {
      return parseInt(match[1].replace(/[.,]/g, ''));
    }
  }
  return 0;
}

export const connectToServer = (
  onStatusChange?: (connected: boolean) => void,
  onClientsUpdate?: (clients: string[]) => void,
  onPayCreated?: (pay: Pay) => void
) => {
  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ??
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const manager = new Manager(wsUrl);

  const socket = manager.socket("/");

  addListeners(socket, onStatusChange, onClientsUpdate, onPayCreated);

  return socket;
};

const addListeners = (
  socket: Socket,
  onStatusChange?: (connected: boolean) => void,
  onClientsUpdate?: (clients: string[]) => void,
  onPayCreated?: (pay: Pay) => void
) => {
  socket.on("connect", () => {
    console.log("connected to server");
    if (onStatusChange) onStatusChange(true);
  });

  socket.on("disconnect", () => {
    console.log("disconnected from server");
    if (onStatusChange) onStatusChange(false);
  });

  socket.on("clients-updated", (clients: string[]) => {
    console.log("Connected clients:", clients);
    if (onClientsUpdate) onClientsUpdate(clients);
  });

  socket.on("pay_created", (pay: Pay) => {
    console.log("New pay created:", pay);
    if (onPayCreated) onPayCreated(pay);
  });
};

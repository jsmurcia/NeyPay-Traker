'use client';

import { useEffect, useState } from "react";
import { connectToServer, Pay } from "../socket-client";
import { Socket } from "socket.io-client";

interface ConnectionStatusProps {
  onPayCreated?: (pay: Pay) => void;
}

export default function ConnectionStatus({ onPayCreated }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [clients, setClients] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = connectToServer(
      (connected) => {
        setIsConnected(connected);
      },
      (clientsList) => {
        setClients(clientsList);
      },
      (pay) => {
        if (onPayCreated) onPayCreated(pay);
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [onPayCreated]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-sm font-medium">
          {isConnected ? 'Conectado al servidor' : 'Desconectado'}
        </span>
      </div>
      
      {clients.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-semibold mb-2">Clientes conectados ({clients.length}):</h3>
          <ul className="space-y-1">
            {clients.map((client, index) => (
              <li key={client} className="text-xs font-mono bg-white dark:bg-gray-900 p-2 rounded">
                {index + 1}. {client}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

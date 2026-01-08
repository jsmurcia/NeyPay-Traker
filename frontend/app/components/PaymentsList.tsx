'use client';

import { useEffect, useState } from "react";
import { Pay } from "../socket-client";
import { extractAmountFromMessage } from "../utils/speech";

interface PaymentsListProps {
  onNewPay?: (pay: Pay) => void;
}

export default function PaymentsList({ onNewPay }: PaymentsListProps) {
  const [payments, setPayments] = useState<Pay[]>([]);

  useEffect(() => {
    if (onNewPay) {
      // Este componente recibirá los pagos desde el componente padre
    }
  }, [onNewPay]);

  const addPayment = (pay: Pay) => {
    setPayments((prev) => [pay, ...prev]);
  };

  // Exponer el método para que el padre pueda llamarlo
  useEffect(() => {
    (window as any).addPayment = addPayment;
  }, []);

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-xl font-bold mb-4">Pagos Recientes</h2>
      {payments.length === 0 ? (
        <p className="text-gray-500">No hay pagos aún. Esperando...</p>
      ) : (
        <ul className="space-y-3">
          {payments.map((payment) => (
            <li 
              key={payment.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-green-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">
                    ${extractAmountFromMessage(payment.message, payment.origin).toLocaleString("es-CO")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Origen: {payment.origin}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(payment.date).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 italic">
                    {payment.message}
                  </p>
                </div>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {payment.id.slice(0, 8)}...
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

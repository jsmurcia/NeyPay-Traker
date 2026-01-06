'use client';

import { useState } from "react";
import ConnectionStatus from "./components/ConnectionStatus";
import PaymentsList from "./components/PaymentsList";
import { Pay } from "./socket-client";
import { speak, formatPaymentMessage } from "./utils/speech";

export default function Home() {
  const [payments, setPayments] = useState<Pay[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handlePayCreated = (pay: Pay) => {
    setPayments((prev) => [pay, ...prev]);
    
    // Anunciar el pago por voz
    if (voiceEnabled) {
      const message = formatPaymentMessage(pay.amount, pay.origin);
      speak(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold mb-8">NetPayTracker</h1>
        
        {/* Toggle para activar/desactivar voz */}
        <div className="mb-4 flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {voiceEnabled ? '🔊 Voz activada' : '🔇 Voz desactivada'}
            </span>
          </label>
        </div>
        
        <ConnectionStatus onPayCreated={handlePayCreated} />
        
        <div className="w-full mt-8">
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
                      <p className="font-semibold text-lg">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Origen: {payment.origin}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(payment.date).toLocaleString()}
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
      </main>
    </div>
  );
}

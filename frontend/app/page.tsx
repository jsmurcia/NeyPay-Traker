"use client";

import { useState } from "react";
import ConnectionStatus from "./components/ConnectionStatus";
import PaymentsList from "./components/PaymentsList";
import { Pay } from "./socket-client";
import {
  speak,
  formatPaymentMessage,
  extractAmountFromMessage,
} from "./utils/speech";

interface PaymentWithTimestamp extends Pay {
  receivedAt: number;
}

export default function Home() {
  const [payments, setPayments] = useState<PaymentWithTimestamp[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);

  const initializeVoice = () => {
    // Inicializar la voz con una interacción del usuario
    speak("Sistema de voz activado");
    setVoiceReady(true);
  };

  const handlePayCreated = (pay: Pay) => {
    const paymentWithTimestamp = {
      ...pay,
      receivedAt: Date.now(),
    };
    setPayments((prev) => [paymentWithTimestamp, ...prev]);

    // Anunciar el pago por voz
    if (voiceEnabled && voiceReady) {
      const amount = extractAmountFromMessage(pay.message, pay.origin);
      const message = formatPaymentMessage(amount, pay.origin);
      console.log("🔊 Intentando hablar:", message);
      speak(message);
    } else {
      console.log("🔇 Voz desactivada o no inicializada");
    }
  };

  console.log("Payments:", payments);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold mb-8">NetPayTracker</h1>

        <div className="w-full mb-4">
          {!voiceReady ? (
            <button
              onClick={initializeVoice}
              className="px-6 py-3 rounded-lg font-bold bg-blue-500 text-white hover:bg-blue-600 animate-pulse"
            >
              🎤 Activar Sistema de Voz (Click aquí primero)
            </button>
          ) : (
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-4 py-2 rounded-lg font-medium ${
                voiceEnabled
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {voiceEnabled ? "🔊 Voz Activada" : "🔇 Voz Desactivada"}
            </button>
          )}
        </div>

        <ConnectionStatus onPayCreated={handlePayCreated} />

        <div className="w-full mt-8">
          <h2 className="text-xl font-bold mb-4">Pagos Recientes</h2>
          {payments.filter((payment) => {
            const now = Date.now();
            const thirtyMinutesAgo = now - 30 * 60 * 1000;
            const paymentTime = new Date(payment.date).getTime();
            return paymentTime >= thirtyMinutesAgo && paymentTime <= now;
          }).length === 0 ? (
            <p className="text-gray-500">
              No hay pagos recientes. Esperando...
            </p>
          ) : (
            <ul className="space-y-3">
              {payments
                .filter((payment) => {
                  const now = Date.now();
                  const thirtyMinutesAgo = now - 30 * 60 * 1000;
                  const paymentTime = new Date(payment.date).getTime();
                  return paymentTime >= thirtyMinutesAgo && paymentTime <= now;
                })
                .map((payment) => (
                  <li
                    key={payment.id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-green-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">
                          ${" "}
                          {extractAmountFromMessage(
                            payment.message,
                            payment.origin
                          ).toLocaleString("es-CO")}
                        </p>
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

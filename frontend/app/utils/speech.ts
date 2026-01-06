export const speak = (text: string) => {
  if ("speechSynthesis" in window) {
    // Cancelar cualquier síntesis anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES"; // Español
    utterance.rate = 1; // Velocidad normal
    utterance.pitch = 1; // Tono normal
    utterance.volume = 1; // Volumen máximo

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech synthesis no está disponible en este navegador");
  }
};

export const formatPaymentMessage = (
  amount: number,
  origin: string
): string => {
  // Convertir origen a texto más amigable
  const originText: Record<string, string> = {
    nequi: "Nequi",
    daviplata: "Daviplata",
  };

  const formattedAmount = amount.toLocaleString("es-CO");

  return `Se recibió un pago de ${formattedAmount} pesos ${
    originText[origin] || ""
  }`;
};

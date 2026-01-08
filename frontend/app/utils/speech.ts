export const speak = (text: string) => {

  console.log("-- speak called with text:", text);
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

  return `Se recibió un pago de ${formattedAmount} pesos desde ${
    originText[origin] || ""
  }`;
};

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
};

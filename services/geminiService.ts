import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getFatwaResponse = async (question: string): Promise<string> => {
  try {
    const ai = getClient();
    const modelId = 'gemini-3-flash-preview'; 

    const systemInstruction = `
      You are a knowledgeable Islamic AI Assistant named "Mustshar".
      Guidelines:
      1. Base answers on the Quran and authentic Sunnah.
      2. Be polite, compassionate, and clear.
      3. If a question is about complex inheritance or divorce, advise consulting a scholar.
      4. Support Arabic and English.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: question,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "عذراً، لم أتمكن من الحصول على إجابة.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالخادم.";
  }
};

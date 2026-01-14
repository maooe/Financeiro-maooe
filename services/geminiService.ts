
import { GoogleGenAI } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
export const queryAIAgent = async (query: string, appData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataString = JSON.stringify(appData);

  try {
    // Guideline: For complex reasoning/math tasks like finance analysis, use 'gemini-3-pro-preview'.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `O usuário perguntou: "${query}". Abaixo estão os dados financeiros atuais do aplicativo: ${dataString}. 
      Responda de forma curta e objetiva em português brasileiro, ajudando o usuário a encontrar informações ou entender suas finanças.`,
      config: {
        temperature: 0.7,
        // Recommended to avoid setting maxOutputTokens if not strictly required to avoid truncation.
      }
    });

    // Guideline: The text property is a getter, not a method.
    return response.text || "Não consegui processar sua busca no momento.";
  } catch (error) {
    console.error("AI Agent Error:", error);
    return "Desculpe, ocorreu um erro ao consultar o agente inteligente.";
  }
};

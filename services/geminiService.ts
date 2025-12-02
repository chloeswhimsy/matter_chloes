import { GoogleGenAI } from "@google/genai";
import { Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReflectionResponse = async (
  goalText: string,
  category: Category,
  reflection: string
): Promise<string> => {
  try {
    const prompt = `
      The user has completed a goal in the category "${category}": "${goalText}".
      They wrote this reflection: "${reflection}".
      
      Act as a wise, gentle forest spirit. Provide a very short, one-sentence poetic acknowledgment or insight that validates their feeling and encourages inner peace or growth.
      Keep it under 20 words. Be mystical but grounded.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "The forest listens to your heart.";
  } catch (error) {
    console.error("Error generating reflection response:", error);
    return "The wind whispers in acknowledgment.";
  }
};

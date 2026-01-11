
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  // Instance for general use, though re-instantiated in methods for reliability as per guidelines
  private ai: GoogleGenAI;

  constructor() {
    // Initializing with named parameter as required
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Edits an image based on a text prompt using the gemini-2.5-flash-image model.
   * Follows guidelines to iterate through response parts for potential image data.
   */
  async editImage(base64Image: string, mimeType: string, prompt: string): Promise<string | null> {
    try {
      // Re-initialize to ensure we have the latest key and configuration right before the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      // The output response may contain both image and text parts; iterate to find the image part.
      const candidates = response.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Gemini Image Edit Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
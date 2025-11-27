import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Vehicle, Driver, Shipment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiAdvice = async (
  prompt: string, 
  vehicles: Vehicle[],
  drivers: Driver[],
  shipments: Shipment[]
): Promise<string> => {
  try {
    const contextData = {
      fleet: vehicles,
      drivers: drivers,
      shipments: shipments
    };
    
    const contextString = JSON.stringify(contextData, null, 2);
    const fullPrompt = `
      You are an expert Transport Management System assistant for "SmartTMS". 
      
      Here is the current operational data:
      ${contextString}

      User Question: ${prompt}

      Instructions:
      1. Answer based on the specific data provided (Vehicle statuses, Driver locations, Shipment ETAs).
      2. If asked about route optimization, suggest specific vehicles to assign to pending shipments based on location and status.
      3. If asked about efficiency, analyze the fleet's fuel levels and load percentages.
      4. Keep responses concise, professional, and actionable.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to the AI service at this time. Please check your connection.";
  }
};
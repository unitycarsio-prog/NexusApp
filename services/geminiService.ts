import { GoogleGenAI, Type } from "@google/genai";
import { AppItem } from "../types";

// Initialize Gemini Client
// process.env.API_KEY is expected to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates a creative description for a new app based on its name and category.
 */
export const generateAppDescription = async (appName: string, category: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "Nexus AI: Please configure your API Key to use AI generation features. This is a fallback description.";
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Write a compelling, marketing-style description (approx 40-60 words) for a mobile app named "${appName}" in the category "${category}". Focus on benefits and excitement.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "Description could not be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again manually.";
  }
};

/**
 * Smart search that matches a natural language query to the most relevant apps from the provided list.
 * Returns a list of App IDs.
 */
export const semanticSearchApps = async (query: string, apps: AppItem[]): Promise<string[]> => {
  try {
    if (!process.env.API_KEY) {
        // Fallback: Simple name filter if no API key
        return apps.filter(a => a.name.toLowerCase().includes(query.toLowerCase())).map(a => a.id);
    }

    const model = 'gemini-2.5-flash';
    
    // Simplify the app list to reduce token usage, sending only relevant metadata
    const simplifiedApps = apps.map(app => ({
      id: app.id,
      name: app.name,
      category: app.category,
      description: app.description,
    }));

    const prompt = `
      You are an intelligent search engine for an app store.
      
      User Query: "${query}"
      
      Available Apps:
      ${JSON.stringify(simplifiedApps)}
      
      Task: Return a JSON object with a single property "appIds" containing an array of app IDs from the available list that best match the user's intent. Sort by relevance. If no apps are relevant, return an empty array.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                appIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        }
      }
    });

    const result = JSON.parse(response.text || '{"appIds": []}');
    return result.appIds || [];

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};
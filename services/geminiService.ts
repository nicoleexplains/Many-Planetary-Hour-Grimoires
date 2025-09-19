
import { GoogleGenAI, Type } from "@google/genai";
import { PlanetaryData, RitualSuggestion } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateInvocation = async (planetaryData: PlanetaryData): Promise<string> => {
    if (!process.env.API_KEY) {
        return "API Key not configured. Please set the API_KEY environment variable to use this feature.";
    }

    const { name, angelicRuler, intelligence, spirit, attributes } = planetaryData;

    const systemInstruction = `
        You are an esoteric scholar and ritualist, deeply versed in Renaissance-era ceremonial magic and the writing style of grimoires like Francis Barrett's 'The Magus'.
        Your purpose is to craft authentic, potent invocations.
        Your responses must be ONLY the invocation text itself, with no surrounding explanations, titles, or introductory phrases like "Here is the invocation:".
        The invocation should be concise, approximately 4-6 lines long.
    `;

    const prompt = `
        Craft a poetic invocation for a magical ritual.

        Astrological Context:
        - Ruling Planet: ${name}
        - Presiding Archangel: ${angelicRuler}
        - Planetary Intelligence: ${intelligence}
        - Planetary Spirit: ${spirit}
        - Associated Themes: ${attributes.join(', ')}

        Instructions:
        1. The style must emulate a 19th-century grimoire.
        2. The tone must be esoteric, reverent, and potent.
        3. Address the celestial beings by name (Archangel, Intelligence, and Spirit).
        4. The invocation should ask to be attuned to the planet's virtues as represented by the associated themes.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 0.95,
            }
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error generating invocation:", error);
        return "An error occurred while communicating with the celestial spheres. Please try again later.";
    }
};

const ritualSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A short, thematic title for the ritual." },
        objective: { type: Type.STRING, description: "A one-sentence description of the ritual's purpose." },
        materials: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of simple, common materials needed. Suggest alternatives if possible (e.g., 'A white candle (or a source of light)')."
        },
        steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A sequence of 3-5 simple, clear steps for the ritual. The steps should be safe and focused on mindfulness or intention-setting."
        },
        finalThought: { type: Type.STRING, description: "A concluding sentence or thought for reflection." }
    },
    required: ["title", "objective", "materials", "steps", "finalThought"]
};


export const generateRitualSuggestion = async (planetaryData: PlanetaryData, focus?: string): Promise<RitualSuggestion | string> => {
     if (!process.env.API_KEY) {
        return "API Key not configured. Please set the API_KEY environment variable to use this feature.";
    }

    const { name, attributes } = planetaryData;

    const prompt = `
        Create a simple, safe, and modern ritual or mindfulness exercise suitable for a beginner, inspired by the esoteric attributes of a planet.
        The ritual should be focused on personal reflection, intention-setting, or meditation. It must not involve anything dangerous, harmful, or complex.
        The tone should be encouraging, respectful, and empowering.

        Astrological Context:
        - Planet: ${name}
        - Associated Themes: ${attributes.join(', ')}

        User's Specific Focus: ${focus || 'General alignment with the planetary energies.'}

        Please tailor the ritual's objective, materials, and steps to align with the user's specific focus, while still being appropriate for the planet's themes.

        Generate a response in JSON format that follows the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: ritualSchema,
            }
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as RitualSuggestion;

    } catch (error) {
        console.error("Error generating ritual suggestion:", error);
        return "An error occurred while consulting the celestial spheres for a ritual. Please try again later.";
    }
};


const talismanSchema = {
    type: Type.OBJECT,
    properties: {
        versicle: { type: Type.STRING, description: "A short, potent, and poetic phrase or sentence to be inscribed on the talisman, in the style of a Renaissance grimoire like 'The Magus'. It should directly relate to the user's intent and the planet's primary virtues." },
        description: { type: Type.STRING, description: "A paragraph describing the talisman's purpose and powers, written in an esoteric, grimoire-like style. It should explain how the talisman helps achieve the user's intent by channeling the planetary virtues." },
    },
    required: ["versicle", "description"]
};

export const generateTalismanInfo = async (planetaryData: PlanetaryData, intent: string): Promise<{ versicle: string; description: string } | string> => {
    if (!process.env.API_KEY) {
        return "API Key not configured. This feature is disabled.";
    }

    const { name, attributes, metal } = planetaryData;

    const prompt = `
        Act as an esoteric scholar versed in Renaissance magic, specifically Francis Barrett's 'The Magus'.
        Create the textual components for a magical talisman.

        Astrological Context:
        - Ruling Planet: ${name}
        - Associated Virtues: ${attributes.join(', ')}
        - Corresponding Metal: ${metal}

        User's Stated Intent: "${intent}"

        Based on this information, generate a short 'versicle' (a potent magical phrase for inscription) and a descriptive paragraph about the talisman's powers. The tone must be authentic to a 19th-century grimoire. The versicle should be a powerful command or blessing. The description should explain how the talisman channels the virtues of ${name} to achieve the user's goal.

        Generate a response in JSON format that follows the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: talismanSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating talisman info:", error);
        return "The celestial currents are turbulent. Could not craft the talisman's essence.";
    }
};

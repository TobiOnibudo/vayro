// Check `~/types/priceSuggestionFromSchema.ts` for the types and schema
import { type FormSchema } from "@/types/priceSuggestionFormSchema";
import { z } from "zod";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    price: { type: SchemaType.NUMBER },
    reason: { type: SchemaType.STRING },
  },
  required: ["price", "reason"],
};

//NOTE: Public since we don't have a backend
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export const geminiResponseSchema = z.object({
  price: z.number(),
  reason: z.string(),
});

export type GeminiResponse = z.infer<typeof geminiResponseSchema>;

export type APIGeminiResponse = {
  success: boolean;
  code: number;
  data: GeminiResponse | null;
  error?: string;
};

export async function getPriceSuggestion(data: FormSchema): Promise<APIGeminiResponse> {
  const { title, description, condition, category, boughtInYear } = data;

  const prompt = `
  You are a helpful assistant that can help me estimate the price of an item.

  Here is the information about the item:
  - Title: ${title}
  - Description: ${description}
  - Condition: ${condition}
  - Category: ${category}
  - Year Bought: ${boughtInYear}

  You then return a JSON object with the price and the reasoning for the price.
  For the reasoning, you should consider the condition of the item, the category, and the year it was bought. This should be about 150 words.

  Please estimate the price of the item in the following format:
  {
    "price": <number>,
    "reason": <string>
  }

  Please be concise and to the point.
  Return the JSON object, nothing else.
  `;

  try {
    const response = await model.generateContent(prompt);
    const result = response.response.text();

    if (!result) {
      return {
        success: false, 
        code: 500,
        data: null,
        error: "Failed to get response from Gemini",
      };
    }

    const parsedResult = JSON.parse(result);

    const validationResult = geminiResponseSchema.safeParse(parsedResult);

    if (!validationResult.success) {
      return {
        success: false,
        code: 500,
        data: null,
        error: "Invalid response format from Gemini",
      };
    }

    return {
      success: true,
      code: 200,
      data: validationResult.data,
    };
    
  } catch (error) {
    return {
      success: false,
      code: 500,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
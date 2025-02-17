// Check `~/types/priceSuggestionFromSchema.ts` for the types and schema
import { type FormSchema } from "@/types/priceSuggestionFormSchema";
import { z } from "zod";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

//NOTE: Public since we don't have a backend
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

//NOTE: learn more about Google Generative AI structured output: https://ai.google.dev/gemini-api/docs/structured-output?lang=node

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    price: { type: SchemaType.NUMBER },
    reason: { type: SchemaType.STRING },
  },
  required: ["price", "reason"],
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

// Create a zod schema to validate the response from Gemini
const geminiResponseSchema = z.object({
  price: z.number(),
  reason: z.string(),
});

type GeminiResponse = z.infer<typeof geminiResponseSchema>;

// API response type
export type APIGeminiResponse = {
  success: boolean;
  code: number;
  data: GeminiResponse | null;
  error?: string;
};

export async function getPriceSuggestion(data: FormSchema): Promise<APIGeminiResponse> {
  const { title, description, condition, category, boughtInYear } = data;

  const prompt = `
  You are a knowledgeable pricing expert specializing in item evaluations and market trends. 

  ### Instructions:
  Please estimate the value of an item based on the details provided below. Your response should be a JSON object that includes both the estimated price and a well-reasoned explanation for that price.

  ### Item Details:
  - Title: ${title}
  - Description: ${description}
  - Condition: ${condition}
  - Category: ${category}
  - Year Bought: ${boughtInYear}

  ### Output Format:
  Your JSON response should follow this structure:
  {
    "price": <number>,
    "reason": <string>
  }

  ### Additional Details:
  - The reasoning should be approximately 150 words and must address how the item's condition, category, and the year of purchase influence its current market value.
  - Please ensure your response is straightforward and concise, providing only the JSON object without any extra commentary or embellishments.

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
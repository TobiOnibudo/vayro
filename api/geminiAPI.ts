// Check `~/types/priceSuggestionFromSchema.ts` for the types and schema
import { type FormSchema } from "@/types/priceSuggestionFormSchema";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

function extractJSONFromText(text: string) {
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (!jsonMatch) {
    console.log("No JSON found in response");
    return null;
  }
  return JSON.parse(jsonMatch[1]);
}

//NOTE: Public since we don't have a backend
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const result = extractJSONFromText(text);

  if (!result) {
    return {
      success: false, 
      code: 500,
      data: null,
      error: "Failed to extract JSON from response",
    };
  }

  const validationResult = geminiResponseSchema.safeParse(result);

  if (!validationResult.success) {
    return {
      success: false,
      code: 500,
      data: null,
      error: "Invalid response from Gemini",
    };
  }

  return {
    success: true,
    code: 200,
    data: validationResult.data,
  };
}
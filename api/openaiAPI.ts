import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const prompt = `
  You are a product analysis assistant. 
  
  # Instructions
  Your task is to carefully examine the provided image of an item for sale and extract detailed information to complete a marketplace listing. Analyze the item's appearance, condition, potential use cases, and any visible features. Provide accurate, detailed, and marketable information for each required field. If certain details aren't visible in the image, make reasonable assumptions based on what you can see.

  Only fill in the fields that you are sure about. If you are not sure about a field, create a placeholder and tell the user to fill it in.

  # Output
  Based on your analysis, provide a JSON object with the following fields:
  - title
  - description
  - condition
  - category
  - price

  # Example
  {
    "title": "Vintage Leather Sofa",
    "description": "A comfortable leather sofa in good condition",
    "condition": "Good",
    "category": "Sofa",
    "price": 1000
  }
`;

export async function visionCompletion(imageUrl: string): Promise<string | null> {
  if (!imageUrl) {
    console.log("No image URL provided");
    return null;
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt
          },
          {
            type: "input_image",
            image_url: imageUrl,
            detail: "low",
          },
        ],
      }],
      text: {
        format: {
          type: "json_schema",
          strict: true,
          name: "user_upload",
          schema: {
            type: "object",
            properties: {
              title: {
                type: "string"
              },
              description: {
                type: "string"
              },
              condition: {
                type: "string"
              },
              category: {
                type: "string"
              },
              price: {
                type: "number"
              },
            },
            required: ["title", "description", "condition", "category", "price"],
            additionalProperties: false,
          },
        }
      }
    });

    // Error handling
    if (!response) {
      return null;
    }

    // Check if the response is incomplete
    if (response.status === "incomplete" && response.incomplete_details?.reason === "max_output_tokens") {
      // Handle the case where the model did not return a complete response
      throw new Error("Incomplete response");
    }

    // Return the output text
    return response.output_text;
    
  } catch (error) {
    console.error("Error in visionCompletion:", error);
    return null;
  }
}

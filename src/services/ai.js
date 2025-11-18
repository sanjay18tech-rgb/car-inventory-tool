import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Gemini API key is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const parseCarDataWithAI = async (rowText, systemPrompt) => {
  const fullPrompt = `
    ${systemPrompt}

    Here is the row data: "${rowText}"
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean the response to ensure it's valid JSON
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Attempt to parse the cleaned text
    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    let errorMessage = "Failed to get a valid response from the AI.";

    // Provide more specific feedback if possible
    if (error instanceof SyntaxError) {
      errorMessage =
        "AI returned malformed JSON. Please check the prompt or try again.";
    } else if (error.message) {
      errorMessage = `API Error: ${error.message}`;
    }

    return {
      error: errorMessage,
    };
  }
};


import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";


const apiKey = "AIzaSyAm_t7QyuKwIfwGGjLMGRCPpVmGzP4AdYY";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateCoverLetter(prompt) {
  if (!prompt) {
    throw new Error('Prompt is required');
  }

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Example usage:
// generateStory("Write a story about a magic backpack.")
//   .then(story => console.log(story))
//   .catch(error => console.error(error));

export { generateCoverLetter };
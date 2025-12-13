import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function run() {
  const models = await genAI.listModels();
  console.log(models);
}

run();

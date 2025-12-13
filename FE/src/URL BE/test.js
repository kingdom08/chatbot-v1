import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("ENV:", process.env.GEMINI_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function run() {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const result = await model.generateContent("Hello dari Gemini");
  console.log(result.response.text());
}

run();

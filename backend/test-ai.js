import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function listModels() {
  let logStr = "";
  try {
    const key = process.env.GEMINI_API_KEY;
    logStr += `Using API Key: ${key ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : "UNDEFINED"}\n`;
    
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    logStr += `Success: ${response.text()}\n`;
  } catch (error) {
    logStr += `Error Name: ${error.constructor.name}\n`;
    logStr += `Error Message: ${error.message}\n`;
    if (error.status) logStr += `Status: ${error.status}\n`;
  }
  fs.writeFileSync("ai-debug-out.txt", logStr);
  console.log("Done. Check ai-debug-out.txt");
}

listModels();

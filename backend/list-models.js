import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function listAllModels() {
  let logStr = "";
  try {
    const key = process.env.GEMINI_API_KEY;
    logStr += `Using API Key: ${key ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : "UNDEFINED"}\n`;
    
    // We need to use the base API to list models.
    // The current SDK doesn't expose listModels directly easily, 
    // but we can try to fetch it via fetch.

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    logStr += `Models List: ${JSON.stringify(data, null, 2)}\n`;
  } catch (error) {
    logStr += `Error: ${error.message}\n`;
  }
  fs.writeFileSync("ai-models-list.txt", logStr);
  console.log("Done. Check ai-models-list.txt");
}

listAllModels();

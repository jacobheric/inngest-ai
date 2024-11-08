import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GEMINI_API_KEY } from "@/lib/config.ts";

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a haiku about recursion in programming.";

const result = await model.generateContent(prompt);
console.log(result.response.text());

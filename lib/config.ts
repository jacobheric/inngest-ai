import "@std/dotenv/load";
export const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
export const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
export const GOOGLE_GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");

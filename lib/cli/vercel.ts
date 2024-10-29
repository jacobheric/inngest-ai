import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { OPENAI_API_KEY } from "@/lib/config.ts";

Deno.env.set(
  "OPENAI_API_KEY",
  OPENAI_API_KEY || "",
);

const result = await generateText({
  model: openai("gpt-3.5-turbo"),
  prompt: "Why is the sky blue?",
});

console.dir(result, { depth: 20 });

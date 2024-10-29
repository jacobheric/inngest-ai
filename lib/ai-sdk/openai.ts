import { generateText } from "ai";
import { OPENAI_API_KEY } from "@/lib/config.ts";

Deno.env.set(
  "OPENAI_API_KEY",
  OPENAI_API_KEY || "",
);

export const completionAISDK = async (
  args: any,
) => await generateText(args);

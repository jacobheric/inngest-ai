import { generateText } from "ai";
import { OPENAI_API_KEY } from "@/lib/config.ts";

type GenerateTextArgs = Parameters<typeof generateText>[0];

Deno.env.set(
  "OPENAI_API_KEY",
  OPENAI_API_KEY || "",
);

export const completionAISDK = async (
  args: GenerateTextArgs,
) => await generateText(args);

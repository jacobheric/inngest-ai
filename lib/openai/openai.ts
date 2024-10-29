import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/lib/config.ts";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/completions";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const completion = async (
  args: ChatCompletionCreateParamsNonStreaming,
) => await openai.chat.completions.create(args);

import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/lib/config.ts";
import { generateText } from "ai";
import { openai as vercelOpenAI } from "@ai-sdk/openai";

import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "@/lib/config.ts";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

Deno.env.set(
  "OPENAI_API_KEY",
  OPENAI_API_KEY || "",
);

export type ProviderType = "openai" | "vercel" | "anthropic";

export const defaultProvider: ProviderType = "openai";
//
// See /cli/openai.ts for a list of available models
type OpenAIModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-3.5"
  | "gpt-3.5-turbo";

type VercelModel = "vercel-model-a" | "vercel-model-b";
type AnthropicModel = "claude-instant" | "claude-2";

export type GenerateInput =
  | { provider: "openai"; model?: OpenAIModel; prompt: string }
  | { provider: "vercel"; model?: VercelModel; prompt: string }
  | { provider: "anthropic"; model?: AnthropicModel; prompt: string };

const defaultModel: {
  [key in ProviderType]: OpenAIModel | VercelModel | AnthropicModel;
} = {
  openai: "gpt-4o-mini",
  vercel: "vercel-model-a",
  anthropic: "claude-instant",
};

export const generate = async (input: GenerateInput) => {
  const { prompt, provider } = input;
  const model = input.model ?? defaultModel[provider];

  switch (provider) {
    case "vercel": {
      console.log("generating text using vercel", { model, prompt });
      return await generateText({ model: vercelOpenAI(model), prompt });
    }
    case "anthropic": {
      console.log("generating text using anthropic", { model, prompt });
      const anthropic = new Anthropic({
        apiKey: ANTHROPIC_API_KEY,
      });

      return await anthropic.messages.create({
        model: model,
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: prompt,
        }],
      });
    }

    default: {
      console.log("generating text using openai", { model, prompt });
      return await openai.chat.completions.create({
        model: "",
        messages: [{ role: "user", content: prompt }],
      });
    }
  }
};

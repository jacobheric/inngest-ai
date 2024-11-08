import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/lib/config.ts";
import { generateText } from "ai";
import { openai as vercelOpenAI } from "@ai-sdk/openai";

import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "@/lib/config.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GEMINI_API_KEY } from "@/lib/config.ts";

Deno.env.set(
  "OPENAI_API_KEY",
  OPENAI_API_KEY || "",
);

export type ProviderType = "openai" | "vercel" | "anthropic" | "google";

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

type GoogleModel = "gemini-1.5-flash" | "gemini-1.5-pro";

export type GenerateInput =
  | { provider: "openai"; model?: OpenAIModel; prompt: string }
  | { provider: "vercel"; model?: VercelModel; prompt: string }
  | { provider: "anthropic"; model?: AnthropicModel; prompt: string }
  | { provider: "google"; model?: GoogleModel; prompt: string };

const defaultModel: {
  [key in ProviderType]:
    | OpenAIModel
    | VercelModel
    | AnthropicModel
    | GoogleModel;
} = {
  openai: "gpt-4o-mini",
  vercel: "vercel-model-a",
  anthropic: "claude-instant",
  google: "gemini-1.5-flash",
};

export const generate = async (input: GenerateInput) => {
  const { prompt, provider } = input;
  const model = input.model ?? defaultModel[provider];

  switch (provider) {
    case "google": {
      console.log("generating text using Google", { model, prompt });
      const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY!);
      const googleModel = genAI.getGenerativeModel({
        model,
      });

      return await googleModel.generateContent(prompt);
    }
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
        model,
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: prompt,
        }],
      });
    }

    default: {
      console.log("generating text using openai", { model, prompt });
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      return await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });
    }
  }
};

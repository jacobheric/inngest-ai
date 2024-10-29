import type { ChatCompletionCreateParamsNonStreaming } from "openai/completions";
import { inngest } from "./client.ts";
import { completion } from "@/lib/openai/openai.ts";
import { completionAISDK } from "@/lib/ai-sdk/openai.ts";

import { openai } from "@ai-sdk/openai";

export const generateText = inngest.createFunction(
  { id: "generate-text" },
  { event: "openai/generate.text" },
  async ({ event, step }) => {
    console.log("generating text using openai", event.data);
    const response = await step.ai(
      "generateText",
      (args: ChatCompletionCreateParamsNonStreaming) => completion(args),
      event.data.prompt,
    );
    return { event, body: response.choices[0].message.content };
  },
);

const prompt = {
  model: openai("gpt-3.5-turbo"),
  prompt: "Write a haiku about recursion in programming.",
};

export const generateTextAiSdk = inngest.createFunction(
  { id: "generate-text-ai-sdk" },
  { event: "ai-sdk/generate.text" },
  async ({ event, step }) => {
    console.log("generating text using ai-sdk", event.data);
    const response = await step.ai(
      "generateText",
      (args: any) => completionAISDK(args),
      prompt,
    );
    return { event, body: response };
  },
);

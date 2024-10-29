import type { ChatCompletionCreateParamsNonStreaming } from "openai/completions";
import { inngest } from "./client.ts";
import { completion } from "@/lib/openai/openai.ts";

const prompt = {
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "Write a haiku about recursion in programming.",
    },
  ],
};

export const generateText = inngest.createFunction(
  { id: "generate-text" },
  { event: "openai/generate.text" },
  async ({ event, step }) => {
    console.log("generating text", event.data);
    const response = await step.ai(
      "generateText",
      (args: ChatCompletionCreateParamsNonStreaming) => completion(args),
      event.data.prompt,
    );
    return { event, body: response.choices[0].message.content };
  },
);

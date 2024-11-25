import { generate } from "../ai/generate.ts";
import { OPENAI_API_KEY } from "@/lib/config.ts";

import { inngest } from "./client.ts";
import { openai } from "inngest";

export const generateText = inngest.createFunction(
  { id: "generate-text" },
  { event: "ai/generate.text" },
  async ({ event, step }) => {
    const { provider, model, prompt } = event.data;
    console.log("running ai wrap");
    const response = await step.ai.wrap(
      "generateText",
      generate,
      { prompt, provider, model },
    );

    return { event, body: response };
  },
);

export const aiInfer = inngest.createFunction(
  { id: "ai-infer-test" },
  { event: "ai/infer.test" },
  async ({ event, step }) => {
    console.log("running ai infer");
    const response = await step.ai.infer("inference", {
      model: openai({
        apiKey: OPENAI_API_KEY,
        model: "chatgpt-4o-latest",
      }),
      body: {
        temperature: .9,
        messages: [{
          role: "user",
          content: "Give me a famous quote about sidewalks and rain.",
        }],
      },
    });

    console.log("ai infer esponse", response);
    return { event, body: response };
  },
);

export const testConcurrency = inngest.createFunction(
  {
    id: "test-concurrency",
    concurrency: { limit: 1, key: "test.concurrency" },
  },
  { event: "test/concurrency" },
  async ({ event, step }) => {
    console.log("sleeping for 30s");
    await step.sleep("wait-a-moment", "30s");
    return { event, body: "I'm awake!" };
  },
);

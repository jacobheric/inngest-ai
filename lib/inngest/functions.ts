import { generate } from "../ai/generate.ts";
import { inngest } from "./client.ts";

export const generateText = inngest.createFunction(
  { id: "generate-text" },
  { event: "ai/generate.text" },
  async ({ event, step }) => {
    const { provider, model, prompt } = event.data;
    const response: any = await step.ai(
      "generateText",
      generate,
      { prompt, provider, model },
    );

    return { event, body: response };
  },
);

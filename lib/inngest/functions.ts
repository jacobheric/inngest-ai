import { OPENAI_API_KEY } from "@/lib/config.ts";
import { openai as vercelOpenAI } from "@ai-sdk/openai";
import { generateText as vercelGenerateText } from "ai";
import { openai as inngestOpenAI } from "inngest";
import OpenAI from "openai";
import { generate } from "../ai/generate.ts";
import { inngest } from "./client.ts";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic();

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("running hello world");
    await step.sleep("wait-a-moment", "1s");

    console.log("ran hello world");
    return { event, body: "Hello, World!" };
  },
);

export const genericWrapGenerateText = inngest.createFunction(
  { id: "generic-wrap-generateText" },
  { event: "generic/wrap.generate.text" },
  async ({ event, step }) => {
    const { provider, model, prompt } = event.data;
    console.log("generic wrapped generate text", provider, model, prompt);
    const wrapResponse = await step.ai.wrap(
      "genericWrappedGenerateText",
      generate,
      { prompt, provider, model },
    );

    console.log("generic wrapped generate text response", wrapResponse);

    return { event, body: wrapResponse };
  },
);

export const anthropicWrapMessageCreate = inngest.createFunction(
  { id: "anthropic-wrap-message-create" },
  { event: "anthropic/wrap.message.create" },
  async ({ event, step }) => {
    //
    // Will fail because anthropic client requires instance context
    // to be preserved across invocations.
    // await step.ai.wrap(
    //   "using-anthropic",
    //   anthropic.messages.create,
    //   {
    //     model: "claude-3-5-sonnet-20241022",
    //     max_tokens: 1024,
    //     messages: [{ role: "user", content: "Hello, Claude" }],
    //   },
    // );

    //
    // Will work beccause we bind to preserve instance context
    const createCompletion = anthropic.messages.create.bind(anthropic.messages);
    await step.ai.wrap(
      "using-anthropic",
      createCompletion,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Hello, Claude" }],
      },
    );
  },
);

export const openAIWrapCompletionCreate = inngest.createFunction(
  { id: "opeai-wrap-completion-create" },
  { event: "openai/wrap.completion.create" },
  async ({ event, step }) => {
    //
    // Will fail because anthropic client requires instance context
    // to be preserved across invocations.
    // await step.ai.wrap(
    //   "openai.wrap.completions",
    //   openai.chat.completions.create,
    //   {
    //     model: "gpt-4o-mini",
    //     messages: [
    //       { role: "system", content: "You are a helpful assistant." },
    //       {
    //         role: "user",
    //         content: "Write a haiku about recursion in programming.",
    //       },
    //     ],
    //   },
    // );

    //
    // Will work beccause we bind to preserve instance context
    const createCompletion = openai.chat.completions.create.bind(
      openai.chat.completions,
    );

    const response = await step.ai.wrap(
      "openai-wrap-completions",
      createCompletion,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: "Write a haiku about recursion in programming.",
          },
        ],
      },
    );
  },
);

export const vercelWrapGenerateText = inngest.createFunction(
  { id: "vercel-wrap-generate-text" },
  { event: "vercel/wrap.generate.text" },
  async ({ event, step }) => {
    //
    // Will work but you will not be able to edit the prompt and rerun the step in the dev server.
    await step.ai.wrap(
      "vercel-openai-generateText",
      vercelGenerateText,
      {
        model: vercelOpenAI("gpt-4o-mini"),
        prompt: "Write a haiku about recursion in programming.",
      },
    );

    //
    // Will work and you will be able to edit the prompt and rerun the step in the dev server because
    // the arguments to step.ai.wrap are JSON serializable.
    const args = {
      model: "gpt-4o-mini",
      prompt: "Write a haiku about recursion in programming.",
    };

    const gen = ({ model, prompt }: { model: string; prompt: string }) =>
      vercelGenerateText({
        model: vercelOpenAI(model),
        prompt,
      });

    await step.ai.wrap("using-vercel-ai", gen, args);
  },
);

export const aiInfer = inngest.createFunction(
  { id: "ai-infer-test" },
  { event: "ai/infer.test" },
  async ({ event, step }) => {
    console.log("running ai infer", OPENAI_API_KEY);
    const response = await step.ai.infer("inference", {
      model: inngestOpenAI({
        apiKey: "",
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

export const aiInferMultiStep = inngest.createFunction(
  { id: "ai-infer-multi-step" },
  { event: "ai/infer.multi.step" },
  async ({ event, step }) => {
    console.log("running ai infer");
    const response = await step.ai.infer("inferenceOne", {
      model: inngestOpenAI({
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

    const responseTwo = await step.ai.infer("inferenceTwo", {
      model: inngestOpenAI({
        apiKey: OPENAI_API_KEY,
        model: "chatgpt-4o-latest",
      }),
      body: {
        temperature: .9,
        messages: [{
          role: "user",
          content: "Give me a famous quote about the desert.",
        }],
      },
    });

    console.log("ai infer response", response);
    return { event, body: responseTwo };
  },
);

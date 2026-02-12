import {
  INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY,
  OPENAI_API_KEY,
} from "@/lib/config.ts";
import { openai as vercelOpenAI } from "@ai-sdk/openai";
import { generateText as vercelGenerateText } from "ai";
import { fetch, NonRetriableError, openai as inngestOpenAI } from "inngest";
import OpenAI from "openai";
import { generate } from "../ai/generate.ts";
import { inngest } from "./client.ts";
//
// @ts-ignore for now
const openai = new OpenAI({ apiKey: OPENAI_API_KEY, fetch });

import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic();

Deno.env.set(
  "INNGEST_EVENT_KEY",
  INNGEST_EVENT_KEY || "",
);
Deno.env.set(
  "INNGEST_SIGNING_KEY",
  INNGEST_SIGNING_KEY || "",
);

console.log("INNGEST_EVENT_KEY", INNGEST_EVENT_KEY);
console.log("INNGEST_SIGNING_KEY", INNGEST_SIGNING_KEY);

export const input = inngest.createFunction(
  { id: "step-with-input", concurrency: 10 },
  { event: "test/step.with.input" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");

    await step.run(
      "step input",
      (foo: number, bar: boolean) => {
        return "step output!";
      },
      5,
      true,
    );

    console.log("ran hello world");
    return { event, body: "step with input!" };
  },
);

export const sendEvent = inngest.createFunction(
  { id: "sendEvent" },
  { event: "test/send.event" },
  async ({ event, step }) => {
    console.log("sending event.data.name", event.data.name);

    await step.sendEvent("hello-world", {
      name: "test/hello.world",
      "data": {
        "after": {
          "analyze_in_original_language": false,
          "created_at": "2026-02-05T00:24:34.591801+00:00",
          "id": "ar_z9AmOyzotNhSq8",
          "status": "created",
          "study_id": "stdy_EHl10jCLtkyVcS",
          "updated_at": null,
        },
        "before": {},
        "op": "c",
        "source": {
          "name": "cdc",
          "schema": "public",
          "table": "analysis_runs",
          "ts_ms": 1770251074604,
        },
        "transaction": null,
        "ts_ms": 1770251074604,
      },
    });

    return { event, body: "tested step.sendEvent!" };
  },
);

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world", if: 'event.data.name.startsWith("XYZ")' },
  async ({ event, step }) => {
    console.log("from event", event);
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Ran hello world!" };
  },
);

export const specialCharacters = inngest.createFunction(
  { id: "special: characters" },
  { event: "test/special.characters" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Ran special characters!" };
  },
);

export const nonRetriable = inngest.createFunction(
  { id: "non-retriable" },
  { event: "test/non.retriable" },
  async ({ event, step }) => {
    event.data.retries = 10;
    console.log("running hello world");
    await step.sleep("wait-a-moment", "1s");

    await step.run("step error", () => {
      throw new NonRetriableError("non retriable error", {
        cause: "something failed terrible",
      });
      return "step #1 output!";
    });

    console.log("ran hello world");
    return { event, body: "Hello, World!" };
  },
);

export const throwError = inngest.createFunction(
  {
    id: "throw-error",
    concurrency: [
      {
        scope: "account",
        key: "failureKey",
        limit: 1,
      },
    ],
  },
  { event: "test/throw.error" },
  async ({ event, step }) => {
    console.log("running a run that throws an error");

    await step.run("fail-atomically", async () => {
      // This entire block counts as active execution
      // until it throws OR returns
      throw new Error("some error...");
    });

    return { event, body: "done!" };
  },
);

export const happyPath = inngest.createFunction(
  {
    id: "happy-path",
    concurrency: [
      {
        scope: "account",
        key: "failureKey",
        limit: 1,
      },
    ],
  },
  { event: "test/happy.path" },
  async ({ event, step }) => {
    console.log("running a run that happy path");
    await step.sleep("wait-for-it", "1s");

    return { event, body: "done!" };
  },
);

export const multipleErrors = inngest.createFunction(
  { id: "multiple-errors" },
  { event: "test/multiple.errors" },
  async ({ event, step }) => {
    event.data.retries = 10;
    console.log("running hello world");
    await step.sleep("wait-a-moment", "1s");

    await step.run("step Random Error", () => {
      if (Math.random() < 0.5) {
        throw new Error("Error A", { cause: "A" });
      } else {
        throw new Error("Error B", { cause: "B" });
      }
    });

    console.log("ran multiple errors");
    return { event, body: "Multiple errors!" };
  },
);

export const longRunning = inngest.createFunction(
  { id: "long-running", concurrency: 1 },
  { event: "test/long.running" },
  async ({ event, step }) => {
    console.log("running ");
    await step.run("block a step run for 10 minutes", async () => {
      // Block for 10 minutes to test concurrency
      await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
      return "done blocking!";
    });

    return { event, body: "Done long running!" };
  },
);

export const conditionalConcurrency = inngest.createFunction(
  {
    id: "conditional-concurrency",
    concurrency: [
      {
        scope: "fn",
        key: "event.data.stack == 'MAIN' ? event.data.testId : null",
        limit: 1,
      },
      {
        scope: "fn",
        key:
          "event.data.stack == 'SECONDARY' ? event.data.anotherTestId : null",
        limit: 5,
      },
    ],
  },
  { event: "test/conditional.concurrency" },
  async ({ event, step }) => {
    console.log("running ");
    await step.run("block a step run for 10 minutes", async () => {
      // Block for 10 minutes to test concurrency
      await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
      return "done blocking!";
    });

    return { event, body: "Done long running!" };
  },
);

export const stepless = inngest.createFunction(
  { id: "stepless" },
  { event: "test/stepless" },
  async ({ event }) => {
    console.log("running stepless");

    return { event, body: "Stepless output" };
  },
);

export const manySteps = inngest.createFunction(
  { id: "many-steps", concurrency: 10 },
  { event: "test/many.steps" },
  async ({ event, step }) => {
    console.log("running many steps");

    for (let i = 0; i < 250; i++) {
      await step.run(`step ${i}`, () => {
        console.log(`step ${i} running`);
        return i % 2 === 0 ? event : `step ${i} output!`;
      });
      await step.sleep("wait-a-moment", "1s");
    }

    console.log("done running many steps");
    return { event, body: "Done long running!" };
  },
);

export const fetchOtel = inngest.createFunction(
  { id: "fetch-otel", retries: 1 },
  { event: "test/fetch.otel" },
  async ({ event, step, logger }) => {
    logger.info("running fetch ");

    await step.run("fetch #1", async () => {
      logger.info("fetching #1");
      await fetch("http://localhost:8000/api/inngest");
      return "fetched #1!";
    });

    await step.sleep("wait-a-moment", "1s");

    await step.run("fetch #2", async () => {
      logger.info("fetching #2");
      await fetch("http://localhost:8000/api/inngest");
      return "fetched #2!";
    });

    logger.info("done fetching!");

    return { event, body: "done fetching!" };
  },
);

export const stepInvoke = inngest.createFunction(
  { id: "step-invoke" },
  { event: "test/step.invoke" },
  async ({ event, step }) => {
    console.log("running step invoke");
    const result = await step.invoke("invoke-by-definition", {
      function: fetchOtel,
      data: {},
    });

    console.log("ran step invoke", result);
    return { event, body: result };
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

export const stepRunFetchOpenAI = inngest.createFunction(
  { id: "step-fetch-openai" },
  { event: "openai/step-fetch" },
  async ({ step }) => {
    await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: "Write a one-sentence bedtime story about a unicorn.",
        },
      ],
    });

    await step.run("open ai step ", async () => {
      const response = await openai.responses.create({
        model: "gpt-4.1",
        input: "Write a two-sentence bedtime story about a unicorn.",
      });
      return response;
    });
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

export const parallelWaitForEvent = inngest.createFunction(
  {
    id: "parallel-wait-for-event",
  },
  { event: "parallel/wait.for.event" },
  async ({ event, step }) => {
    const { rowId = "123" } = event.data;

    const [, completionEvent] = await Promise.all([
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await step.sendEvent("parallel/wait.for.event", {
          name: "parallel/wait.for.event",
          data: { rowId },
        });
      })(),

      // Wait for this workflow to complete
      step.waitForEvent("parallel-wait-for-workflow-completion", {
        event: "parallel/wait.for.event",
        timeout: "15 minutes",
        if: `async.data.rowId == "${rowId}"`,
      }),
    ]);

    const error = completionEvent && "error" in completionEvent.data
      ? completionEvent.data.error
      : undefined;

    return {
      rowId,
      error,
    };
  },
);

export const sequentialWaitForEvent = inngest.createFunction(
  {
    id: "sequential-wait-for-event",
  },
  { event: "sequential/wait.for.event" },
  async ({ event, step }) => {
    const { rowId = "1234" } = event.data;

    const completionEvent = await step.waitForEvent(
      "wait-for-workflow-completion",
      {
        event: "sequential/wait.for.event",
        timeout: "15 minutes",
        if: `async.data.rowId == "${rowId}"`,
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));
    await step.sendEvent("sequential/wait.for.event", {
      name: "sequential/wait.for.event",
      data: { rowId },
    });

    const error = completionEvent && "error" in completionEvent.data
      ? completionEvent.data.error
      : undefined;

    return {
      rowId,
      error,
    };
  },
);

import { OPENAI_API_KEY } from "@/lib/config.ts";
import { openai as vercelOpenAI } from "@ai-sdk/openai";
import { generateText as vercelGenerateText } from "ai";
import { NonRetriableError, openai as inngestOpenAI } from "inngest";
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

export const derp = inngest.createFunction(
  { id: "derp" },
  { event: "test/derp" },
  async ({ event, step }) => {
    console.log("running derp");
    await step.sleep("wait-a-moment", "1s");

    console.log("ran derp");
    return { event, body: "Derp!" };
  },
);

export const anotherDerp = inngest.createFunction(
  { id: "another-derp" },
  { event: "test/another.derp" },
  async ({ event, step }) => {
    console.log("running another derp");
    await step.sleep("wait-a-moment", "1s");

    console.log("ran another derp");
    return { event, body: "Another Derp!" };
  },
);

export const throwError = inngest.createFunction(
  { id: "throw-error" },
  { event: "test/throw.error" },
  async ({ event, step }) => {
    console.log("running a run that throws an error");
    await step.sleep("wait-for-it", "1s");

    throw new Error(
      "some error....",
    );

    return { event, body: "done!" };
  },
);

export const greeting = inngest.createFunction(
  { id: "greeting-workflow" },
  { event: "greeting/workflow" },
  async ({ step }) => {
    console.log("  → Starting workflow");
    const upperName = await step.run("uppercase", async () => {
      console.log("  → Running step: uppercase");
      return "test";
    });

    const greeting = await step.run("create-greeting", async () => {
      console.log("  → Running step: create-greeting");
      return `Hello, ${upperName}!`;
    });

    return greeting;
  },
);

export const returnError = inngest.createFunction(
  { id: "return-error" },
  { event: "test/return.error" },
  async ({ event, step }) => {
    console.log("running a run that returns an error");
    await step.sleep("wait-for-it", "1s");

    return {
      event,
      error:
        "This is a really really long error message that we want to truncate in the UI! lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    };
  },
);

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

export const multipleInputs = inngest.createFunction(
  { id: "step-with-multiple-inputs" },
  { event: "test/step.with.multiple.inputs" },
  async ({ event, step }) => {
    await step.run(
      "step input #1",
      (foo: number, bar: boolean) => {
        return { foo, bar };
      },
      5,
      true,
    );
    await step.run(
      "step input #2",
      (foo: number, bar: boolean) => {
        return { foo, bar };
      },
      5,
      true,
    );
    await step.run(
      "step input #3",
      (foo: number, bar: boolean) => {
        return { foo, bar };
      },
      5,
      true,
    );
    await step.run(
      "step input #4",
      (foo: number, bar: boolean) => {
        return { foo, bar };
      },
      5,
      true,
    );
    await step.run(
      "step input #5",
      (foo: number, bar: boolean) => {
        return { foo, bar };
      },
      5,
      true,
    );

    console.log("ran multiple inputs");
    return { event, body: "step with multiple inputs!" };
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

export const nonRetriable = inngest.createFunction(
  { id: "non-retriable" },
  { event: "test/non.retriable" },
  async ({ event, step }) => {
    event.data.retries = 10;
    console.log("running hello world");
    await step.sleep("wait-a-moment", "1s");

    await step.run("step error", () => {
      throw new NonRetriableError("non retriable error", {
        cause: { shiKeyt: "shitValue" },
      });
      return "step #1 output!";
    });

    console.log("ran hello world");
    return { event, body: "Hello, World!" };
  },
);

export const nullFunction = inngest.createFunction(
  { id: "null-function" },
  { event: "test/null.function" },
  async ({ event, step }) => {
    return null;
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

export const manySteps = inngest.createFunction(
  { id: "many-steps", concurrency: 10 },
  { event: "test/many.steps" },
  async ({ event, step }) => {
    console.log("running many steps");

    for (let i = 0; i < 500; i++) {
      await step.run(`step ${i}`, () => {
        console.log(`step ${i} running`);
        return i % 2 === 0 ? event : `step ${i} output!`;
      });
    }

    console.log("done running many steps");
    return { event, body: "Done many steps!" };
  },
);

export const aThousandAndOneSteps = inngest.createFunction(
  { id: "a-thousand-and-one-steps", concurrency: 10 },
  { event: "test/a.thousand.and.one.steps" },
  async ({ event, step }) => {
    console.log("running a thousand and one steps");

    for (let i = 0; i < 1001; i++) {
      await step.run(`step ${i}`, () => {
        console.log(`step ${i} running`);
        return `step ${i} output!`;
      });
    }

    console.log("done running a thousand and one steps");
    return { event, body: "Done many steps!" };
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

export const processUser = inngest.createFunction(
  { id: "process-user" },
  { event: "user/process" },
  async ({ event, step, attempt }) => {
    // Step 1: Fetch and validate user
    const user = await step.run("get-user", async () => {
      const userData = await fetchUser(event.data.userId);

      if (!userData) {
        throw new NonRetriableError("User not found");
      }

      if (!userData.email || !userData.isActive) {
        throw new NonRetriableError("User missing email or inactive");
      }

      // At this point, TypeScript knows email is non-null
      return userData; // email: string | null (but we validated it's not null)
    });

    // Step 2: Use the validated user
    await step.run("send-email", async () => {
      await sendEmail(user.email, "Welcome!");
    });
  },
);

const fetchUser = async (userId: string) => {
  return await Promise.resolve({
    id: userId,
    email: "test@test.com",
    isActive: true,
  });
};

const sendEmail = async (email: string, message: string) => {
  console.log("Sending email to", email, "with message", message);
  return await Promise.resolve({ sent: true, messageId: "msg_123" });
};

export const sendEvent = inngest.createFunction(
  { id: "sendEvent" },
  { event: "test/send.event" },
  async ({ event, step }) => {
    console.log("sending event.data.name", event.data.name);

    await step.sendEvent("hello-world", {
      name: "test/hello.world",
      data: { name: event.data.name },
    });

    return { event, body: "tested step.sendEvent!" };
  },
);

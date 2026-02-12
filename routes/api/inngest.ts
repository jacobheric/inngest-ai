import { inngest } from "@/lib/inngest/client.ts";
import {
  aiInfer,
  aiInferMultiStep,
  anthropicWrapMessageCreate,
  conditionalConcurrency,
  fetchOtel,
  genericWrapGenerateText,
  happyPath,
  helloWorld,
  input,
  longRunning,
  manySteps,
  multipleErrors,
  nonRetriable,
  openAIWrapCompletionCreate,
  parallelWaitForEvent,
  sendEvent,
  sequentialWaitForEvent,
  specialCharacters,
  stepInvoke,
  stepless,
  stepRunFetchOpenAI,
  throwError,
  vercelWrapGenerateText,
} from "@/lib/inngest/functions.ts";
import { serve } from "inngest/deno/fresh";
import type { FreshContext } from "fresh";

const inngestHandler = serve({
  client: inngest,
  functions: [
    helloWorld,
    genericWrapGenerateText,
    anthropicWrapMessageCreate,
    openAIWrapCompletionCreate,
    vercelWrapGenerateText,
    aiInfer,
    aiInferMultiStep,
    fetchOtel,
    stepRunFetchOpenAI,
    stepInvoke,
    longRunning,
    nonRetriable,
    manySteps,
    multipleErrors,
    stepless,
    input,
    sendEvent,
    throwError,
    conditionalConcurrency,
    parallelWaitForEvent,
    sequentialWaitForEvent,
    specialCharacters,
    happyPath,
  ],
});

//
// Bridge Fresh 2.0's context to the Inngest Fresh adapter
// Inngest's Fresh adapter expects (req: Request) as first argument
export const handler = {
  GET: (ctx: FreshContext) => inngestHandler(ctx.req),
  POST: (ctx: FreshContext) => inngestHandler(ctx.req),
  PUT: (ctx: FreshContext) => inngestHandler(ctx.req),
};

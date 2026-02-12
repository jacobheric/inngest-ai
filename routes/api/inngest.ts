import { inngest } from "@/lib/inngest/client.ts";
import {
  aiInfer,
  aiInferMultiStep,
  anotherDerp,
  anthropicWrapMessageCreate,
  aThousandAndOneSteps,
  derp,
  fetchOtel,
  genericWrapGenerateText,
  greeting,
  helloWorld,
  input,
  longRunning,
  manySteps,
  multipleInputs,
  nonRetriable,
  nullFunction,
  openAIWrapCompletionCreate,
  processUser,
  returnError,
  sendEvent,
  stepless,
  throwError,
  vercelWrapGenerateText,
} from "@/lib/inngest/functions.ts";
import { serve } from "inngest/deno/fresh";
import type { FreshContext } from "fresh";

const inngestHandler = serve({
  client: inngest,
  functions: [
    helloWorld,
    sendEvent,
    genericWrapGenerateText,
    anthropicWrapMessageCreate,
    openAIWrapCompletionCreate,
    vercelWrapGenerateText,
    aiInfer,
    aiInferMultiStep,
    nullFunction,
    fetchOtel,
    nonRetriable,
    manySteps,
    stepless,
    input,
    longRunning,
    processUser,
    throwError,
    returnError,
    multipleInputs,
    aThousandAndOneSteps,
    greeting,
    derp,
    anotherDerp,
  ],
});

//
// Fresh 2 handlers receive context first, but Inngest expects a Request
export const handler = {
  GET: (ctx: FreshContext) => inngestHandler(ctx.req),
  POST: (ctx: FreshContext) => inngestHandler(ctx.req),
  PUT: (ctx: FreshContext) => inngestHandler(ctx.req),
};

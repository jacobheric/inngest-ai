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
import type { Context } from "fresh";
import { State } from "../../utils.ts";

const inngestHandler = serve({
  client: inngest,
  functions: [
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
  ],
});

//
// Fresh 2 handlers receive context first, but Inngest expects a Request
export const handler = {
  GET: (ctx: Context<State>) => inngestHandler(ctx.req),
  POST: (ctx: Context<State>) => inngestHandler(ctx.req),
  PUT: (ctx: Context<State>) => inngestHandler(ctx.req),
};

import { inngest } from "@/lib/inngest/client.ts";
import {
  aiInfer,
  aiInferMultiStep,
  anthropicWrapMessageCreate,
  genericWrapGenerateText,
  helloWorld,
  openAIWrapCompletionCreate,
  vercelWrapGenerateText,
} from "@/lib/inngest/functions.ts";
import { serve } from "inngest/deno/fresh";

export const handler = serve({
  client: inngest,
  functions: [
    helloWorld,
    genericWrapGenerateText,
    anthropicWrapMessageCreate,
    openAIWrapCompletionCreate,
    vercelWrapGenerateText,
    aiInfer,
    aiInferMultiStep,
  ],
});

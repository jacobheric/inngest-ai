import { serve } from "inngest/deno/fresh";
import { inngest } from "@/lib/inngest/client.ts";
import { generateText, generateTextAiSdk } from "@/lib/inngest/functions.ts";

export const handler = serve({
  client: inngest,
  functions: [generateText, generateTextAiSdk],
});

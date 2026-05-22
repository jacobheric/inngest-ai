import { Inngest } from "inngest";

const hasExplicitMode = Deno.env.get("INNGEST_DEV") !== undefined;
const defaultToDev = Deno.env.get("NODE_ENV") !== "production";

export const inngest = new Inngest({
  id: "inngest-ai-dev",
  ...(hasExplicitMode ? {} : { isDev: defaultToDev }),
});

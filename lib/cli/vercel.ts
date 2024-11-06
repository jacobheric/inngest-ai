import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { parseArgs } from "@std/cli";
import { ANTHROPIC_API_KEY, OPENAI_API_KEY } from "@/lib/config.ts";

Deno.env.set(
  "OPENAI_API_KEY",
  OPENAI_API_KEY || "",
);

Deno.env.set(
  "ANTHROPIC_API_KEY",
  ANTHROPIC_API_KEY || "",
);

const flags = parseArgs(Deno.args, {
  string: ["provider"],
  default: { provider: "openai" },
});

export const generate = async () => {
  switch (flags.provider) {
    case "anthropic": {
      const result = await generateText({
        model: anthropic("claude-3-5-sonnet-20241022"),
        prompt: "Write a haiku about recursion in programming.",
      });
      console.dir(result, { depth: 20 });
      return;
    }
    default: {
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: "Write a haiku about recursion in programming.",
      });
      console.dir(result, { depth: 20 });
      return;
    }
  }
};

void generate();

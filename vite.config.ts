import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  server: {
    port: 8000,
    allowedHosts: ["host.docker.internal", "localhost"],
  },
  ssr: {
    external: [
      "inngest",
      "inngest/deno/fresh",
      "inngest/components/InngestCommHandler.js",
      "@ai-sdk/openai",
      "@ai-sdk/anthropic",
      "ai",
      "openai",
      "@anthropic-ai/sdk",
      "@google/generative-ai",
    ],
  },
  build: {
    rollupOptions: {
      external: [
        /^inngest/,
        /^@ai-sdk\//,
        /^@vercel\//,
        /^ai$/,
        /^openai$/,
        /^@anthropic-ai\//,
        /^@google\//,
      ],
    },
  },
});

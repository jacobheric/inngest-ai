import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "@/lib/config.ts";

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: "Write a haiku about recursion in programming.",
  }],
});

console.dir(msg, { depth: 20 });

// {
//   id: "msg_01Y6Wvw6DuoQT3abrsQPuCs9",
//   type: "message",
//   role: "assistant",
//   model: "claude-3-5-sonnet-20241022",
//   content: [
//     {
//       type: "text",
//       text: "Here's a haiku about recursion:\n" +
//         "\n" +
//         "Function calls itself\n" +
//         "Until base case is reached, then\n" +
//         "Returns back through time"
//     }
//   ],
//   stop_reason: "end_turn",
//   stop_sequence: null,
//   usage: { input_tokens: 17, output_tokens: 30 }
// }

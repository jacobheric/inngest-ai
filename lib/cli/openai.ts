import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/lib/config.ts";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// const models = [
//   "gpt-4-turbo-2024-04-09",
//   "tts-1-1106",
//   "dall-e-2",
//   "whisper-1",
//   "gpt-3.5-turbo-instruct",
//   "tts-1-hd-1106",
//   "gpt-3.5-turbo",
//   "gpt-3.5-turbo-0125",
//   "babbage-002",
//   "gpt-4o-2024-05-13",
//   "davinci-002",
//   "dall-e-3",
//   "gpt-4o-realtime-preview",
//   "gpt-4o-realtime-preview-2024-10-01",
//   "gpt-4o-mini",
//   "gpt-4o-mini-2024-07-18",
//   "tts-1-hd",
//   "tts-1",
//   "chatgpt-4o-latest",
//   "gpt-4-turbo-preview",
//   "gpt-4o-2024-08-06",
//   "gpt-4-1106-preview",
//   "text-embedding-ada-002",
//   "gpt-4o",
//   "gpt-3.5-turbo-16k",
//   "gpt-4-turbo",
//   "text-embedding-3-small",
//   "text-embedding-3-large",
//   "gpt-3.5-turbo-1106",
//   "gpt-4o-audio-preview",
//   "gpt-4o-audio-preview-2024-10-01",
//   "gpt-4-0613",
//   "gpt-4-0125-preview",
//   "gpt-4",
//   "gpt-3.5-turbo-instruct-0914",
// ];

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "Write a haiku about recursion in programming.",
    },
  ],
});

console.dir(completion, { depth: 20 });

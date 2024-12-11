import { inngest } from "@/lib/inngest/client.ts";

export const send = async () => {
  try {
    await inngest.send({
      "name": "test/hello.world",
      "data": { "test": "data" },
    });
  } catch (err) {
    console.log("ERROR!", err);
  }

  console.log("Events sent!");
};

send();

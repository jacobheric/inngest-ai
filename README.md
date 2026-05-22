# Inngest AI Sample Application

It's built with Deno fresh, see more at https://fresh.deno.dev/

### Set env vars in .env, example:

```
OPENAI_API_KEY=openai-api-key


INNGEST_DEV=1
INNGEST_EVENT_KEY=inngest-event-key
INNGEST_SIGNING_KEY=inngest-signing-key
INNGEST_BASE_URL=http://localhost:8288
NODE_ENV=development
```

### Run the app

```
deno task dev
```

This will watch the project directory and restart as necessary.

### Run production build

```
deno task build
deno task start
```

### cli - send test prompts to openai

```
deno task openai
```

```
deno task vercel
```

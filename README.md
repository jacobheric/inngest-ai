# Inngest AI Sample Application

It's built with Deno fresh, see more at https://fresh.deno.dev/

### Set env vars in .env, example:

```
OPENAI_API_KEY=openai-api-key


INNGEST_EVENT_KEY=inngest-event-key
INNGEST_SIGNING_KEY=inngest-signing-key
NODE_ENV=production 
INNGEST_API_BASE_URL=http://localhost:8090 
INNGEST_EVENT_API_BASE_URL=http://localhost:9999
```

### Run the app

```
deno task start
```

This will watch the project directory and restart as necessary.

### cli

```
deno task openai
```

```
deno task vercel
```

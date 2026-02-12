import { HttpError } from "fresh";
import { define } from "@/utils.ts";

export default define.page(function ErrorPage(ctx) {
  const error = ctx.error;

  if (error instanceof HttpError && error.status === 404) {
    return (
      <div class="px-4 py-8 mx-auto">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <p class="my-4">The page you were looking for doesn't exist.</p>
          <a href="/" class="underline">
            Go back home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">500 - Internal Server Error</h1>
        <p class="my-4">Something went wrong.</p>
        <a href="/" class="underline">
          Go back home
        </a>
      </div>
    </div>
  );
});

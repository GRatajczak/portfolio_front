import { defineMiddleware } from "astro:middleware";

// Successful page responses are cached at the Cloudflare edge (`cache.enabled`
// in wrangler.jsonc) for a day, while browsers always revalidate. Publishing
// in Sanity purges the edge cache through /api/revalidate, and every deploy
// starts with an empty cache because the Worker version is part of the key.
const EDGE_CACHE_CONTROL = "public, max-age=0, s-maxage=86400";

export const onRequest = defineMiddleware(async (context, next) => {
    const response = await next();

    if (
        context.request.method === "GET" &&
        !context.url.pathname.startsWith("/api/") &&
        response.status === 200 &&
        !response.headers.has("cache-control") &&
        !response.headers.has("set-cookie")
    ) {
        response.headers.set("Cache-Control", EDGE_CACHE_CONTROL);
    }

    return response;
});

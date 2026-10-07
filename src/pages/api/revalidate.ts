import type { APIRoute } from "astro";
import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";

const UNAUTHORIZED_MESSAGE = "Unauthorized webhook request.";
const MISCONFIGURED_MESSAGE =
    "SANITY_WEBHOOK_SECRET is not configured on the server.";

function getBearerToken(authorizationHeader: string | null) {
    if (!authorizationHeader) {
        return "";
    }

    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        return "";
    }

    return token.trim();
}

export const POST: APIRoute = async ({ request, url, locals }) => {
    const webhookSecret = import.meta.env.SANITY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new Response(MISCONFIGURED_MESSAGE, { status: 500 });
    }

    const secretFromQuery = url.searchParams.get("secret") ?? "";
    const bearerToken = getBearerToken(request.headers.get("authorization"));
    const rawPayload = await request.text();
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);

    const isAuthorized = signature
        ? await isValidSignature(rawPayload, signature, webhookSecret)
        : secretFromQuery === webhookSecret || bearerToken === webhookSecret;

    if (!isAuthorized) {
        return new Response(UNAUTHORIZED_MESSAGE, { status: 401 });
    }

    let payload: Record<string, unknown> = {};
    try {
        payload = rawPayload
            ? (JSON.parse(rawPayload) as Record<string, unknown>)
            : {};
    } catch {
        payload = {};
    }

    // Purges the edge cache in every data center (not available in dev).
    const edgeCache = (
        locals.cfContext as
            | {
                  cache?: {
                      purge: (options: { purgeEverything: true }) => Promise<unknown>;
                  };
              }
            | undefined
    )?.cache;
    let purge: unknown = null;
    try {
        purge = edgeCache
            ? await edgeCache.purge({ purgeEverything: true })
            : null;
    } catch (error) {
        // A 5xx makes Sanity retry the webhook.
        return new Response(`Edge cache purge failed: ${String(error)}`, {
            status: 502,
        });
    }

    return Response.json({
        ok: true,
        revalidated: true,
        purge,
        at: new Date().toISOString(),
        documentId: payload._id ?? null,
        documentType: payload._type ?? null,
    });
};

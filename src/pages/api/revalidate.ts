import type { APIRoute } from "astro";
import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { invalidateSanityDataCache } from "@/lib/sanity";

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

export const POST: APIRoute = async ({ request, url }) => {
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

    invalidateSanityDataCache();

    return Response.json({
        ok: true,
        revalidated: true,
        at: new Date().toISOString(),
        documentId: payload._id ?? null,
        documentType: payload._type ?? null,
    });
};

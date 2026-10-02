import type { APIRoute } from "astro";
import {
    CONTACT_FROM_EMAIL,
    CONTACT_TO_EMAIL,
    RESEND_API_KEY,
} from "astro:env/server";

export const prerender = false;

const RESEND_URL = "https://api.resend.com/emails";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = {
    name: string;
    email: string;
    message: string;
    website: string;
    locale: string;
};

const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const asText = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

async function readFields(request: Request): Promise<Fields | null> {
    const contentType = request.headers.get("content-type") ?? "";

    try {
        const source: Record<string, unknown> = contentType.includes(
            "application/json",
        )
            ? await request.json()
            : Object.fromEntries(await request.formData());

        return {
            name: asText(source.name),
            email: asText(source.email),
            message: asText(source.message),
            website: asText(source.website),
            locale: asText(source.locale),
        };
    } catch {
        return null;
    }
}

function validate({ name, email, message }: Fields) {
    if (name.length < 1 || name.length > 100) return "name";
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) return "email";
    if (message.length < 1 || message.length > 5000) return "message";
    return null;
}

export const POST: APIRoute = async ({ request, redirect }) => {
    const isJson = (request.headers.get("content-type") ?? "").includes(
        "application/json",
    );
    const fields = await readFields(request);

    // Plain HTML form posts (no JS) get a redirect back instead of JSON.
    const respond = (
        status: number,
        body: Record<string, unknown>,
        locale = "",
    ) => {
        if (isJson) return json(body, status);

        const base = locale === "pl" ? "/pl/contact" : "/contact";
        const query = status === 200 ? "sent=1" : `error=${body.error}`;
        return redirect(`${base}?${query}`, 303);
    };

    if (!fields) return respond(400, { ok: false, error: "invalid_body" });

    const invalidField = validate(fields);
    if (invalidField) {
        return respond(
            400,
            { ok: false, error: "validation", field: invalidField },
            fields.locale,
        );
    }

    // Honeypot: bots fill the hidden field; pretend it worked.
    if (fields.website) return respond(200, { ok: true }, fields.locale);

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
        return respond(
            503,
            { ok: false, error: "not_configured" },
            fields.locale,
        );
    }

    // No CR/LF in header-bound values.
    const safeName = fields.name.replace(/[\r\n]+/g, " ");

    try {
        const response = await fetch(RESEND_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: CONTACT_FROM_EMAIL,
                to: CONTACT_TO_EMAIL,
                reply_to: fields.email,
                subject: `Portfolio message from ${safeName}`,
                text: `Name: ${safeName}\nEmail: ${fields.email}\n\n${fields.message}`,
            }),
        });

        if (!response.ok) {
            console.error(
                "[contact] Resend error",
                response.status,
                await response.text(),
            );
            return respond(502, { ok: false, error: "send_failed" }, fields.locale);
        }
    } catch (error) {
        console.error("[contact] Resend request failed", error);
        return respond(502, { ok: false, error: "send_failed" }, fields.locale);
    }

    return respond(200, { ok: true }, fields.locale);
};

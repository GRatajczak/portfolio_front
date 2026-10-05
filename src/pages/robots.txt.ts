import type { APIRoute } from "astro";
import { PUBLIC_SITE_URL } from "astro:env/client";

export const GET: APIRoute = ({ url }) => {
    const base = (PUBLIC_SITE_URL || url.origin).replace(/\/+$/, "");
    const lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "",
        `Sitemap: ${base}/sitemap.xml`,
    ];

    return new Response(lines.join("\n") + "\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};

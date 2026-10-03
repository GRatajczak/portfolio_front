import type { APIRoute } from "astro";
import { PUBLIC_SITE_URL } from "astro:env/client";

export const GET: APIRoute = () => {
    const lines = ["User-agent: *", "Allow: /", "Disallow: /api/"];
    if (PUBLIC_SITE_URL) {
        lines.push("", `Sitemap: ${PUBLIC_SITE_URL.replace(/\/+$/, "")}/sitemap.xml`);
    }

    return new Response(lines.join("\n") + "\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};

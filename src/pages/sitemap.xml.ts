import type { APIRoute } from "astro";
import { PUBLIC_SITE_URL } from "astro:env/client";
import {
    DEFAULT_LOCALE,
    getPageRouteSlugs,
    getProjectRouteSlugs,
} from "@/lib/sanity";

const escapeXml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async () => {
    if (!PUBLIC_SITE_URL) {
        return new Response("PUBLIC_SITE_URL is not configured", {
            status: 503,
        });
    }

    const base = PUBLIC_SITE_URL.replace(/\/+$/, "");
    const [enPages, plPages, projects] = await Promise.all([
        getPageRouteSlugs(DEFAULT_LOCALE, DEFAULT_LOCALE),
        getPageRouteSlugs("pl", DEFAULT_LOCALE),
        getProjectRouteSlugs(DEFAULT_LOCALE, DEFAULT_LOCALE),
    ]);

    const paths = new Set<string>([
        "/",
        "/pl",
        "/contact",
        "/pl/contact",
        ...enPages.map((slug) => `/${slug}`),
        ...plPages.map((slug) => `/pl/${slug}`),
        ...projects.map((slug) => `/work/${slug}`),
    ]);

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...paths].map((path) => `  <url><loc>${escapeXml(base + path)}</loc></url>`).join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
};

// @ts-check
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import { defineConfig, envField } from "astro/config";

const defaultSanityApiVersion = "2026-04-20";
const rootDirectory = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare(),
    output: "server",
    image: {
        domains: ["cdn.sanity.io"],
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "hover",
    },
    env: {
        schema: {
            PUBLIC_SANITY_PROJECT_ID: envField.string({
                context: "client",
                access: "public",
                optional: true,
            }),
            PUBLIC_SANITY_DATASET: envField.string({
                context: "client",
                access: "public",
                optional: true,
            }),
            PUBLIC_SANITY_API_VERSION: envField.string({
                context: "client",
                access: "public",
                optional: true,
                default: defaultSanityApiVersion,
            }),
        },
    },
    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: [
                "hypervigilant-marilou-observant.ngrok-free.dev",
                "localhost",
                "127.0.0.1",
            ],
        },
        resolve: {
            alias: {
                "@": resolve(rootDirectory, "src"),
            },
        },
    },
});

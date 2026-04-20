// @ts-check
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

const defaultSanityApiVersion = "2026-04-20";
const rootDirectory = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
    image: {
        domains: ["cdn.sanity.io"],
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
        resolve: {
            alias: {
                "@": resolve(rootDirectory, "src"),
            },
        },
    },
});

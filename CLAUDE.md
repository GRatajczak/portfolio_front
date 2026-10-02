# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build locally
npm run cf:dev       # Run via Wrangler (Cloudflare Workers locally)
npm run cf:deploy    # Build + deploy to Cloudflare Workers
```

No test runner is configured.

## Architecture

**Stack:** Astro SSR + Sanity CMS + Tailwind CSS v4 + Cloudflare Workers adapter.

### Data flow

All content comes from Sanity. `src/lib/sanity.ts` centralizes all GROQ queries and fetch functions. Each page fetch also retrieves global data (header/footer nav, social links) in a single combined query — global data is **not** fetched separately.

An in-memory cache (`sanityDataCache` Map) deduplicates Sanity requests within a request lifecycle. The cache is fully invalidated when Sanity sends a webhook to `POST /api/revalidate`.

### Page Builder pattern

Pages in Sanity are built from an array of block types (`pageBuilder` field). `src/utils/pageBuilder/componentsMapper.ts` maps each Sanity `_type` string to an Astro section component. `PageBuilder.astro` iterates the array and renders the appropriate component. To add a new page section type:

1. Create `src/sections/<name>/index.astro` and `index.type.ts`
2. Add it to `componentsMapper.ts`
3. Add the corresponding GROQ projection in `src/lib/sanity.ts` inside `PAGE_QUERY`

### Routing and i18n

- English (default): `/`, `/[slug]`, `/work/[projectURL]`, `/contact`
- Polish: `/pl/`, `/pl/[slug]`, `/pl/contact` (no `/pl/work/` routes yet)

Localization works by appending `-pl` to Sanity slugs. `getLocalizedPageSlug` / `toRouteSlug` handle the translation between route slugs and Sanity slugs. The `DEFAULT_LOCALE` is `"en"`.

### Conventions

- Every component and section lives in its own folder: `ComponentName/index.astro` + `ComponentName/index.type.ts`.
- Path alias `@` resolves to `src/`.
- `src/lib/sanity.types.ts` contains auto-generated Sanity schema types; `src/lib/sanity.type.ts` contains hand-written derived types used across the app.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-04-20
SANITY_WEBHOOK_SECRET=   # server-only, for /api/revalidate
RESEND_API_KEY=          # server-only, for POST /api/contact (503 when missing)
CONTACT_TO_EMAIL=        # server-only, inbox receiving contact messages
CONTACT_FROM_EMAIL=      # server-only, sender on a domain verified in Resend
```

The app degrades gracefully when Sanity is not configured (`isSanityConfigured` guard in `sanity.ts`).

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

### Design system ("terminal / dev")

Tokens live in `@theme` in `src/styles/global.css` (`bg`, `bg-alt`, `surface`, `line`, `line-strong`, `tag-border`, `fg`, `fg-soft`, `muted`, `dim`, `acc` = accent, `going` = in-progress status). Fonts: Geist (sans) and JetBrains Mono (mono), self-hosted in `public/fonts/` — no Google Fonts. Utilities: `bg-grid`, `clip-corner(-sm)`, `animate-blink`. Element-level rules in `global.css` are wrapped in `@layer base`, so Tailwind utilities override them (e.g. put `text-[13px]` on the `<a>` itself, not its parent).

Shared building blocks: `Button` (`primary` / `outline`), `Eyebrow`, `Tag` (optional technology `svg`), `StatusDot`, `FileFrame`, `TabDivider`, `Lightbox` (one native `<dialog>` per page, opened by any `[data-lightbox-src]`).

### Data flow

All content comes from Sanity. `src/lib/sanity.ts` centralizes all GROQ queries and fetch functions. Each page fetch also retrieves global data (header/footer nav, social links) in a single combined query — global data is **not** fetched separately.

Rendered pages are cached at the Cloudflare edge: `cache.enabled` in `wrangler.jsonc` puts the cache in front of the Worker, and `src/middleware.ts` marks successful `GET` page responses with `s-maxage` (browsers get `max-age=0`). Sanity publishes hit `POST /api/revalidate`, which purges the whole edge cache with `ctx.cache.purge`; each deploy starts with an empty cache. Sanity results are therefore not cached in memory (a stale isolate copy would end up in the edge cache) — `dedupeSanityRequest` only shares identical requests in flight. Responses with `Set-Cookie` or their own `Cache-Control` are left alone.

### Page Builder pattern

Pages in Sanity are built from an array of block types (`pageBuilder` field). `src/utils/pageBuilder/componentsMapper.ts` maps each Sanity `_type` string to an Astro section component. `PageBuilder.astro` iterates the array and renders the appropriate component. To add a new page section type:

1. Create `src/sections/<name>/index.astro` and `index.type.ts`
2. Add it to `componentsMapper.ts`
3. Add the corresponding GROQ projection in `src/lib/sanity.ts` inside `PAGE_QUERY`

`getSectionLayout()` (`src/utils/pageBuilder/helpers.ts`) alternates section backgrounds (`bg` / `bg-alt`) and places a `TabDivider` between sections. The tab label comes from the block's optional `tabLabel` field, then from the `TAB_LABELS` map by `_type`. The first section and the one after a `subhero` get no divider. Sections receive a `surface` prop.

The case study page (`src/pages/work/[projectURL].astro`) does **not** use `PageBuilder`: it renders the hero, brief grid and one shared "features" section itself, numbering and alternating `textAndImage` blocks by order.

### Client scripts

Plain TypeScript in `src/scripts/` (`typing.ts` for the hero, `matrix.ts` for the hover effect, registered once from `Layout`). The site uses `ClientRouter` (View Transitions), so scripts start on `astro:page-load`, clean up on `astro:before-swap` and use delegated `document` listeners. `t()` calls in component frontmatter must come after the `useTranslations` line — a render error there yields a `200` with an empty `<body>`, which `npm run build` does not catch.

### Routing and i18n

- English (default): `/`, `/[slug]`, `/work/[projectURL]`, `/contact`
- Polish: `/pl/`, `/pl/[slug]`, `/pl/contact` (no `/pl/work/` routes yet)

UI strings that are not Sanity content live in `src/i18n/ui.ts` (`en` / `pl` dictionaries, `useTranslations(Astro.url)`, `formatYears`). The locale is derived from the route (`/pl…`). Add a key to `en` first — `pl` is typed against it.

Localization works by appending `-pl` to Sanity slugs. `getLocalizedPageSlug` / `toRouteSlug` handle the translation between route slugs and Sanity slugs. The `DEFAULT_LOCALE` is `"en"`.

### Contact form

`src/sections/contactForm/` posts JSON to `POST /api/contact` (`src/pages/api/contact.ts`), which sends mail through Resend with `fetch`. It also accepts a plain form post (redirects back with `?sent=1` / `?error=<code>`). Without `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` it answers `503`.

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
PUBLIC_SITE_URL=         # public, canonical/hreflang/sitemap/robots base, e.g. https://example.com
SANITY_WEBHOOK_SECRET=   # server-only, for /api/revalidate
RESEND_API_KEY=          # server-only, for POST /api/contact (503 when missing)
CONTACT_TO_EMAIL=        # server-only, inbox receiving contact messages
CONTACT_FROM_EMAIL=      # server-only, sender on a domain verified in Resend
```

The app degrades gracefully when Sanity is not configured (`isSanityConfigured` guard in `sanity.ts`).

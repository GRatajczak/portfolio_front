# Analiza SEO projektu i plan wdrożenia

## Audyt SEO (stan obecny)

### Co jest na plus
- Strony są renderowane po stronie serwera (Astro SSR), więc treść jest indeksowalna.
- Występuje sensowna semantyka nagłówków (`h1` w hero/contact).
- Obrazy zwykle mają `alt`, a część z nich korzysta z `loading="lazy"`.

### Najważniejsze braki / ryzyka
- Brak warstwy meta SEO w `src/layouts/Layout.astro`:
  - stały `<title>` dla wszystkich podstron
  - brak `meta description`
  - brak `canonical`
  - brak meta Open Graph / Twitter
  - brak kontroli `noindex` dla stron technicznych
- Brak `robots.txt` i `sitemap.xml` (lub ich odpowiedników jako endpointy).
- Brak `site` w `astro.config.mjs`, co utrudnia poprawne canonicale i sitemapę.
- `lang` jest ustawiony statycznie na `en`, także dla tras `/pl`.
- Brak `hreflang` pomiędzy wersjami językowymi (`en`, `pl`, `x-default`).
- Brak danych strukturalnych (JSON-LD), np. `Person` i `WebSite`.
- Niewykorzystany potencjał danych z Sanity pod SEO (aktualnie pobierane jest głównie `title`).
- W części miejsc wykorzystywany jest zwykły `<img>` zamiast `Image` z `astro:assets`.

## Plan wdrożenia

## Faza 1 - szybkie wygrane (1-2 dni)
1. Dodać centralny interfejs SEO do layoutu (`title`, `description`, `canonical`, `ogImage`, `lang`, `noindex`).
2. Uzupełnić `<head>` o:
   - title/description
   - canonical
   - Open Graph
   - Twitter Card
   - robots
3. Ustawić dynamiczny `lang` (`en`/`pl`) na podstawie ścieżki lub jawnego propsa.
4. Dodać `site` w `astro.config.mjs`.
5. Dodać `robots.txt` i `sitemap.xml`.

## Faza 2 - i18n i indeksacja (1 dzień)
6. Wdrożyć `hreflang` dla par URL (`/` <-> `/pl`, `/contact` <-> `/pl/contact`, itd.).
7. Dodać poprawne canonicale dla każdej podstrony, żeby uniknąć duplikacji między językami.

## Faza 3 - content i dane strukturalne (2-3 dni)
8. Rozszerzyć model Sanity o obiekt `seo`:
   - `metaTitle`
   - `metaDescription`
   - `ogImage`
   - `noindex`
9. Wpiąć pola SEO z Sanity do renderowania `<head>` na stronach:
   - home
   - contact
   - dynamiczne `[slug]`
10. Dodać JSON-LD:
   - `Person` (portfolio)
   - `WebSite`
   - opcjonalnie `ItemList` dla projektów/certyfikatów.

## Faza 4 - Core Web Vitals i technikalia (1-2 dni)
11. Zamienić newralgiczne `<img>` na `Image` z `astro:assets` tam, gdzie to możliwe.
12. Sprawdzić LCP:
   - obraz hero
   - priorytety ładowania
   - preloading kluczowych zasobów
13. Zweryfikować spójność:
   - 1 unikalny `h1` na stronę
   - unikalny `title`
   - unikalny `description`.

## Faza 5 - monitoring i utrzymanie (ciągłe)
14. Podpiąć Google Search Console i Bing Webmaster Tools.
15. Wykonać pomiary Lighthouse/PageSpeed dla kluczowych URL:
   - `/`
   - `/contact`
   - `/pl`
   - `/pl/contact`
   - wybrane strony dynamiczne.
16. Przygotować checklistę publikacji SEO (meta, canonical, hreflang, indexability, schema).

## Rekomendowana kolejność
- P0: Layout SEO + dynamiczny `lang` + canonical + robots/sitemap.
- P1: `hreflang` + pola SEO z Sanity.
- P2: JSON-LD + dalsze optymalizacje Core Web Vitals.


## Progress

- 2026-10-02: **Fazy 1–2 (kod) ✅** — `Layout` przyjmuje `title`/`description`/`ogImage`/`noindex`/`noAlternates`; `<html lang>` z trasy; canonical, hreflang (en/pl/x-default; pomijany dla `/work/*`), Open Graph, Twitter; `robots.txt` i `sitemap.xml` jako endpointy. Domena z env `PUBLIC_SITE_URL` (bez niej: tylko title/description, sitemap 503) — **ustaw ją w produkcji** (`.env`/Cloudflare var). Domyślny opis w `src/i18n/ui.ts`. Fazy 3–5 (pola `seo` w Sanity, JSON-LD, CWV, monitoring) — todo.

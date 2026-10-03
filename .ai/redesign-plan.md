# Redesign portfolio — plan dla agenta

Plan wdrożenia nowego designu „terminal / dev” w `portfolio_front` (Astro SSR + Sanity + Tailwind v4 + Cloudflare Workers).
Pracuj krok po kroku, w kolejności. Po każdym kroku zaktualizuj sekcję **Progress** (na dole pliku).

---

## Kontekst i źródła

- **Design (źródło prawdy):** `.ai/design/Portfolio Redesign.dc.html` — kopia z projektu Claude Design
  `dca60da0-b37c-4c77-88ec-fe4d14d8ba47`. Plik to prototyp (`<x-dc>` + `sc-if`/`sc-for` + klasa `Component` na dole).
  - Markup ekranów: bloki `<sc-if value="{{ isHome }}">`, `isAbout`, `isWork`, `isCerts`, `isCase`, `isContact`, header, mobile menu, footer, lightbox.
  - Logika (efekt pisania, matrix hover, timeline, karuzela): skrypt na dole pliku (`initMatrix`, `componentDidMount`, `renderVals`).
  - Treści/obrazy w designie są przykładowe — **dane bierzemy z Sanity**, nie hardkodujemy.
- **Mobile:** `Portfolio Mobile.dc.html` to tylko podgląd tego samego pliku w 390×844. Brak osobnego layoutu → implementujemy responsywnie. Breakpoint menu mobilnego: `< 760px`.
- **Sanity Studio:** osobne repo `../portfolio_sanity` (`sections/`, `components/`, `pages/`, typegen: `npm run typegen`). Typy po typegen kopiujemy do `src/lib/sanity.types.ts`.
- **Konwencje repo:** patrz `CLAUDE.md` (komponent = folder `index.astro` + `index.type.ts`, alias `@` → `src/`, GROQ tylko w `src/lib/sanity.ts`).
- **Dokumentacja bibliotek** (Astro, Tailwind v4, Resend, Sanity): pobieraj przez `ctx7` zgodnie z regułą użytkownika.

## Decyzje (zatwierdzone)

| Temat | Decyzja |
|---|---|
| Kolor akcentu | Domyślny z designu: `#3DDC84` (jedna zmienna `--color-acc`) |
| Formularz kontaktowy | Resend przez endpoint `POST /api/contact` na Workers. **Bez klucza API na razie** — kod gotowy, klucz w env później |
| Efekt pisania w hero | Tak |
| Efekt „matrix hover” | Tak (wyłączony dla `hover: none` i `prefers-reduced-motion`) |
| Branch / commity | Branch `redesign`, osobny commit per krok (lub per etap) |
| Wariant listy certyfikatów (`certLayout: list`) | Pomijamy — tylko mozaika |

## Tokeny designu (ściąga)

| Token | Wartość |
|---|---|
| `bg` | `#0A0A0C` |
| `bg-alt` | `#111114` |
| `surface` | `#0D0D10` |
| `line` | `#26262C` |
| `line-strong` | `#3A3A42` |
| `tag-border` | `#2E2E35` |
| `fg` | `#EDEDEA` |
| `fg-soft` | `#D4D4D8` |
| `muted` | `#A1A1AA` |
| `dim` | `#71717A` |
| `acc` | `#3DDC84` |
| status done / going | `#3DDC84` / `#F5B544` |
| Fonty | Geist 300–700 (sans), JetBrains Mono 400–600 (mono) |
| Kontener | `max-width: 1240px`, padding X `clamp(20px,4vw,48px)` |
| Siatka tła | `linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px)` ×2, `56px 56px` |
| Ścięte rogi | `clip-path: polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))` |
| Header | fixed, 72px, `rgba(10,10,12,.82)` + `backdrop-filter: blur(12px)`, border-bottom `line` |

---

## Kroki

### Etap 0 — Fundamenty

**Krok 0.1 — Branch i fonty**
- `git checkout -b redesign`.
- Pobierz Geist i JetBrains Mono (`.woff2`, variable jeśli dostępne) do `public/fonts/`, dodaj `@font-face`. Usuń Inter i Alfa Slab One (pliki + `@font-face`) dopiero gdy nic ich nie używa.
- ✅ Gotowe gdy: fonty ładują się lokalnie (bez Google Fonts), `npm run build` przechodzi.

**Krok 0.2 — Tokeny i style globalne** (`src/styles/global.css`)
- Zastąp `@theme` tokenami z tabeli wyżej (`--color-*`, `--font-sans`, `--font-mono`).
- Zaktualizuj typografię bazową: nagłówki Geist 600, `letter-spacing: -.04em`, `line-height` ~1; usuń stary system `--font-size-h*` jeśli nieużywany po redesignie (lub dostosuj do `clamp()` z designu: H1 hero `clamp(56px,9vw,124px)`, H1 subhero `clamp(56px,10vw,136px)`, H2 `clamp(40px,6vw,72px)`).
- Dodaj utility (`@utility` w Tailwind v4): `bg-grid`, `clip-corner` (14px) i `clip-corner-sm` (12px), `@keyframes blink` + `animate-blink`, `::selection` (tło `acc`, tekst `bg`).
- ✅ Gotowe gdy: body ma tło `#0A0A0C`, tekst Geist, utility działają.

**Krok 0.3 — Komponenty bazowe** (każdy: `index.astro` + `index.type.ts`)
- `Button` — warianty `primary` (tło `acc`, tekst `bg`, clip-corner) i `outline` (wrapper 1px `line-strong` → hover `acc`, wnętrze w kolorze tła sekcji; prop `surface: "bg" | "bg-alt"`). Obsługa `href`, `external`, `type="submit"`. Atrybut `data-matrix="btn"`.
- `Eyebrow` — `// tekst`, mono 13px, `acc`.
- `Tag` — mono 12px, border `tag-border`, padding `5px 10px`, `fg-soft`. Wariant `accent` (border `acc`).
- `StatusDot` — kropka 8px + `status: done | in progress` (mapowanie z `project.category`: `done`/`going`).
- `FileFrame` — ramka z paskiem nagłówka (lewy/prawy label mono 11px `dim`), slot na treść.
- `TabDivider` — pasek 28px z clip-path „zakładki” i etykietą `● plik`. Propsy: `label`, `from` (tło sekcji powyżej), `to` (tło poniżej). Desktop/mobile różnią się clip-path (wartości `tabClip`/`tabLeft`/`tabW` z `renderVals()` w designie) — przełączaj media query.
- Zaktualizuj `Container` (1240px + padding z tokenów), `Heading`, `Text`, `Link` (mono warianty, `data-matrix="link"`).
- ✅ Gotowe gdy: komponenty istnieją i są użyte co najmniej w jednym miejscu (lub w kroku 1.x).

### Etap 1 — Layout globalny

**Krok 1.1 — Header** (`src/components/Header/index.astro`)
- Logo: `~/` (acc) + `ratajczak` + migający kursor 8×16 (`animate-blink`).
- Desktop nav z `headerMenuItems`: numer `01.` (acc) + label mono 13px; aktywny link `fg`, pozostałe `muted` (porównanie z `Astro.url.pathname`; strona projektu `/work/*` podświetla „Work”).
- CTA „Get in touch” → `/contact` (`/pl/contact` dla PL), `Button primary` mały (clip 12px).
- `body`/`main` dostaje `padding-top: 72px`.
- ✅ Gotowe gdy: header zgodny z designem na ≥760px.

**Krok 1.2 — Mobile menu** (`src/components/Header/MobileMenu.astro`)
- Hamburger 44×44, dwie kreski (druga w `acc`), animacja w „X” (`translateY(±4px) rotate(±45deg)`).
- Panel fixed od `top:72px` do dołu, `bg-grid`, `$ ls ~/ratajczak`, linki 40px/600 z numerami `00.`…(Home + header items), na dole CTA pełnej szerokości + LinkedIn/GitHub/Instagram ↗ (z globali).
- Blokada scrolla (`overflow:hidden` na `html` + `touchmove` preventDefault poza headerem), zamykanie po kliknięciu linku i przy resize ≥760px.
- Skrypt inicjalizowany na `astro:page-load` (projekt używa `ClientRouter`) — bez duplikowania listenerów.
- ✅ Gotowe gdy: działa na 390px, przeżywa nawigację View Transitions.

**Krok 1.3 — Footer** (`src/components/Footer/index.astro`)
- `TabDivider label="footer.tsx"` nad stopką, tło stopki `bg-alt`.
- 3 kolumny (`auto-fit, minmax(min(100%,220px),1fr)`): logo + social ↗ / `// Quick links` (z `footerMenuItems` + Contact) / `// Contact` (tel, email).
- Dolny pasek: `© {rok} | Grzegorz Ratajczak` · `Poland` · `Privacy Policy`.
- ✅ Gotowe gdy: zgodny z designem desktop + mobile.

**Krok 1.4 — Rytm sekcji w PageBuilder** (`src/utils/pageBuilder/PageBuilder.astro`)
- PageBuilder nadaje sekcjom naprzemienne tło (`bg` / `bg-alt`) i wstawia `TabDivider` między nimi. Pierwsza sekcja (hero/subhero) bez dividera. Sekcje przyjmują prop `surface` (potrzebny m.in. dla `Button outline`).
- Etykieta zakładki: opcjonalne pole `tabLabel` w bloku Sanity (krok 6.1), fallback mapą `_type → nazwa` (np. `technologiesStack → stack.ts`, `aboutMe → about.tsx`, `projectsShowcase → work.tsx`, `certificatesGallery → certificates.tsx`, `experienceTimeline → git log`, `currentFocus → now.md`, `projectSectionsGrid → brief.md`, `textAndImage → features.tsx`).
- Uwaga: subhero + następna sekcja na stronach About/Work/Certs/Contact mają w designie **to samo tło bez dividera** — obsłuż (np. flaga „continues previous” dla sekcji po subhero).
- ✅ Gotowe gdy: home renderuje się z naprzemiennymi tłami i zakładkami jak w designie.

### Etap 2 — Strona główna

**Krok 2.1 — `hero`**
- Sekcja `bg-grid`, grid `auto-fit minmax(min(100%,420px),1fr)`, `align-items:end`.
- Lewo: `$ whoami`, H1 `headline`, linia z efektem pisania: `>` + tekst + kursor 11×24. Teksty z `subheadline[]`.
- Efekt pisania: mały skrypt (`src/scripts/typing.ts`), tempo jak w designie (62ms pisanie, 28ms kasowanie, 1800ms pauza), start na `astro:page-load`, sprzątanie timera na `astro:before-swap`. `prefers-reduced-motion` → statyczny pierwszy tekst. Bez JS → pierwszy tekst w HTML.
- Prawo: portret (`portraitImage`, `mobileImage` w `<picture>`), narożniki 28px w `acc` (top-left, top-right), gradient dołem 30% do `bg`, `filter: grayscale(.15) contrast(1.05)`.
- ✅ Gotowe gdy: zgodne z designem desktop/mobile, animacja działa po nawigacji.

**Krok 2.2 — `technologiesStack`**
- `FileFrame` z nagłówkiem `src/stack.ts` / `{N} items`; treść: `export const stack = [` (acc), tagi `'Nazwa'` (hover: border `acc`), `] as const;`.
- Usuń dotychczasową animację GSAP z tej sekcji.
- ✅ Gotowe gdy: zgodne z designem.

**Krok 2.3 — `aboutMe` + `ImageGrid`**
- Lewo: `Eyebrow` (eyebrow), H2, akapity z `description`, `Button outline` z `button`.
- Prawo: grid `1fr 1.15fr`, 3 zdjęcia: [0] `aspect 3/4` align-end, [1] `aspect 2/3` `row-span-2`, [2] `aspect 3/2`.
- Usuń GSAP z `ImageGrid` jeśli niepotrzebny.
- ✅ Gotowe gdy: zgodne z designem.

**Krok 2.4 — `projectsShowcase` + `Project`**
- Nagłówek sekcji: eyebrow + H2 + `Button outline` „See more” (z `button`), `justify-between`, wrap.
- Wariant `rows` (home): artykuły grid 2 kolumny; lewo `FileFrame` (`{slug}.preview.png` / `01 / 04`) ze zdjęciem 3/2; prawo `StatusDot`, H3, akapity `content`, „Technologies:” + `Tag`i, CTA `primary`: „See live ↗” (`projectUrl`, external) lub „See case study →” (`/work/{slug}` gdy projekt ma `pageBuilder`/case study).
- Wariant `grid` (strona Work): karty `auto-fill minmax(min(100%,460px),1fr)`, ramka `line`, tło `bg-alt`, nagłówek pliku, zdjęcie, status, H3, lead (pierwszy akapit), tagi `margin-top:auto`, link mono w `acc`.
- Wybór wariantu: pole `layout` (krok 6.1), fallback `rows`.
- Usuń GSAP z `Project` jeśli niepotrzebny.
- Wymaga w GROQ: `category`, `slug`, `projectUrl`, flaga czy istnieje case study (np. `"hasCaseStudy": count(pageBuilder) > 0`).
- ✅ Gotowe gdy: home i strona Work zgodne z designem.

**Krok 2.5 — `Lightbox`** (nowy komponent)
- Natywny `<dialog>`: tło `rgba(5,5,7,.92)`, obraz `max-w min(1100px,100%)`, `max-h 80vh`, podpis `{title} · esc`. Zamykanie: Esc, klik w tło. Jeden lightbox na stronę, otwierany przez `data-lightbox-src`/`data-lightbox-title`.
- ✅ Gotowe gdy: działa z klawiatury i dotyku.

**Krok 2.6 — `certificatesGallery`**
- Nagłówek: H2 + przyciski ←/→ (48×48, border `line-strong`, hover `acc`) + `Button outline` „See more”.
- Karuzela: natywny `overflow-x:auto` + `scroll-snap`, karty `flex: 0 0 min(82%,380px)`, `aspect 16/10`, dolny pasek `01 Tytuł` / `.png` (rozszerzenie z URL assetu). Strzałki przewijają o szerokość karty + gap. Full-bleed do krawędzi ekranu (ujemny margines = padding kontenera).
- Klik → `Lightbox` (pełna rozdzielczość `?w=2000`).
- Usuń Swipera z tej sekcji; po 2.2–2.6 sprawdź, czy `swiper`/`gsap` są jeszcze gdziekolwiek używane — jeśli nie, usuń z `package.json`.
- ✅ Gotowe gdy: karuzela działa myszą, dotykiem i strzałkami.

### Etap 3 — About

**Krok 3.1 — `subhero`**
- `bg-grid`, `Eyebrow`, H1 `clamp(56px,10vw,136px)`, linia: `~/{slug}` (mono 12px `dim`) + kreska 2px `acc` na resztę szerokości (gdy `highlightLine`).
- Ścieżka z route'a (`/about` → `~/about`, PL bez sufiksu `-pl`).
- ✅ Gotowe gdy: wspólny subhero działa na About/Work/Certs/Contact.

**Krok 3.2 — Nowa sekcja `aboutProfile`**
- Sanity (`../portfolio_sanity/sections/aboutProfile.ts`, rejestracja w `sections/index.ts` i w `pageBuilder` w `pages/page.ts`). Pola:
  - `image` (z `alt`), `fileLabel` (np. `grzegorz.jpg`), `fileMeta` (np. `since 2018`), `captionTitle`, `captionSubtitle`;
  - `lead` (portable text z dekoratorem `highlight` → kolor `acc`);
  - `pathLabel` (np. `path`), `path[]`: `{ label, isCurrent }`;
  - `facts[]`: `{ label, body (portable text), tags[]: { text, accent: boolean } }`.
- Frontend `src/sections/aboutProfile/`: grid 2 kolumny; lewo `figure` sticky (`top: 96px`, na mobile `relative`) z nagłówkiem pliku, zdjęciem 4/5, figcaption `$ whoami`; prawo lead 24–34px, `// path` z kafelkami `01 →` (aktywny: border `acc`, `03 ● now`), `<dl>` z wierszami `label` (mono `dim`, 120px) + treść/tagi.
- Projekcja w `PAGE_QUERY`, wpis w `componentsMapper.ts`, typegen.
- Wypełnij treść w Studio na podstawie designu (EN + PL) — **poproś użytkownika o potwierdzenie przed publikacją treści w Sanity**.
- ✅ Gotowe gdy: strona About pokazuje sekcję z danymi z Sanity.

**Krok 3.3 — `experienceTimeline` + `ExperienceTimelineCard`**
- Nagłówek: eyebrow + H2.
- Pasek lat (44px, `bg`, border `line`): segmenty pozycjonowane absolutnie wg `period` (`YYYY` lub `YYYY-YYYY`; pierwszy wpis = do „teraz”), zakres od najwcześniejszego roku do bieżącej daty. Kolory: development (bieżący) `acc`, development (przeszłe) `color-mix(in oklch, var(--color-acc) 55%, #111114)`, it support `line-strong`. Tooltip (firma + zakres) na hover i tap. Oś lat pod spodem (`2017`, `'18`, …), legenda.
- Rodzaj wpisu: pole `kind` (`development`/`support`, krok 6.1), fallback: rola zawiera „Support” → support.
- Lista wpisów `git log`: lewo okres (pierwszy `YYYY — now` w `acc`) + `{kind} · {N} yrs`; prawo rola H3 + `@ firma` (acc) + badge `HEAD` dla pierwszego, opis, tagi technologii (jeśli są).
- Skrypt tooltipów: minimalny, na `astro:page-load`.
- ✅ Gotowe gdy: pasek proporcjonalny, tooltipy działają desktop + mobile.

**Krok 3.4 — `currentFocus`**
- Grid 2 kolumny: H2 + opis; karta (border `line`, `bg-alt`): zdjęcie 16/10, `StatusDot`, H3, opis projektu.
- ✅ Gotowe gdy: zgodne z designem.

### Etap 4 — Work, Certificates, Case study

**Krok 4.1 — Strona Work** — `subhero` + `projectsShowcase` w wariancie `grid` (ustawienie w Studio po kroku 6.1). ✅ Gotowe gdy: zgodne z designem.

**Krok 4.2 — `certificatesGrid`** — mozaika `auto-fill minmax(min(100%,280px),1fr)`, gap 8px, karty jak w karuzeli, klik → `Lightbox`. ✅ Gotowe gdy: zgodne z designem.

**Krok 4.3 — Case study** (`src/pages/work/[projectURL].astro` + sekcje projektu)
- Hero: `bg-grid`, link `← cd ../work`, eyebrow z `subtitle`, H1 tytuł, `Tag`i technologii.
- Pod hero: główne zdjęcie 16/9 z ramką + lead (19px, `fg-soft`, max 820px).
- `projectSectionsGrid` → brief: grid `auto-fit minmax(min(100%,300px),1fr)` z 1px liniami między komórkami (`gap:1px` na tle `line`), `0N /`, H3, tekst.
- `projectTextAndImage` → `// 0N` (numer liczony z kolejności bloków tego typu), H3, tekst, obraz; naprzemienny `row` / `row-reverse`.
- `projectImage`, `projectTwoImages` → ramki `line`; `richTextSection` / `RichText` → nowa typografia (H3 26–38px, akapity 16px `muted`, `strong` w `fg`).
- Zakładki `brief.md` / `features.tsx` przez PageBuilder (krok 1.4).
- ✅ Gotowe gdy: strona projektu „Move with Nat” zgodna z designem.

### Etap 5 — Kontakt + Resend

**Krok 5.1 — Endpoint `POST /api/contact`** (`src/pages/api/contact.ts`)
- Sprawdź aktualne API Resend przez `ctx7` (SDK `resend` vs. `fetch` na `https://api.resend.com/emails` — na Workers preferuj `fetch`, bez dodatkowej zależności, chyba że docs zalecają SDK).
- Env w `astro.config.mjs` (`envField`, `context: "server"`, `access: "secret"`, `optional: true`): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Dodaj je do `.env.example` (puste) i do sekcji env w `CLAUDE.md`.
- Walidacja: `name` (1–100), `email` (format), `message` (1–5000); honeypot (ukryte pole `website` — wypełnione → udawany sukces); `Reply-To` = email nadawcy.
- Odpowiedzi JSON: `200 { ok: true }`, `400` błąd walidacji, `503 { error: "not_configured" }` gdy brak `RESEND_API_KEY` (aplikacja działa bez klucza), `502` błąd Resend.
- ✅ Gotowe gdy: bez klucza endpoint zwraca 503, a walidacja 400 — sprawdzone `curl`em na `npm run dev`.

**Krok 5.2 — Strona kontaktu** (zastępuje `contactBanner` w `src/pages/contact.astro` i `src/pages/pl/contact.astro`)
- `subhero` (`// Get in touch`, `Contact`, `~/contact`).
- Lewo: `FileFrame` `contact.json` z `"email"`, `"phone"`, `"location"` (z globali), pod spodem `Button outline` LinkedIn/GitHub/Instagram ↗.
- Prawo: karta `new-message.sh` / `POST /contact`, formularz (`$ name`, `$ email`, `$ message`, focus border `acc`, info o Privacy Policy, `Button primary` „Send message”).
- JS: `fetch` na `/api/contact`, stan wysyłania (disabled), sukces → `$ ./new-message.sh` / `✓ 200 OK — message sent.` / `Thanks, {name}…` / `← send another`; błąd → komunikat w tym samym stylu (`✗ …`), dla 503 komunikat z fallbackiem `mailto:`.
- Bez JS formularz nadal działa (`method="post" action="/api/contact"` + obsługa `application/x-www-form-urlencoded` w endpoincie, redirect na `/contact?sent=1`).
- ✅ Gotowe gdy: formularz zgodny z designem, wszystkie stany sprawdzone (sukces zasymulowany mockiem lub testowym kluczem, jeśli użytkownik go poda).

### Etap 6 — Sanity, efekty, i18n, sprzątanie

**Krok 6.1 — Zmiany schematów Sanity** (`../portfolio_sanity`) — wykonaj przed krokami, które ich potrzebują (2.4, 3.2, 3.3, 1.4)
- `projectsShowcase.layout`: `rows` | `grid` (domyślnie `rows`).
- `experienceTimeline.entries[].kind`: `development` | `support`.
- Opcjonalne `tabLabel` (string) w sekcjach Page Buildera.
- Nowy `aboutProfile` (krok 3.2).
- `npm run typegen` → skopiuj typy do `src/lib/sanity.types.ts`, zaktualizuj projekcje w `src/lib/sanity.ts`.
- **Deploy Studio i edycja treści tylko po zgodzie użytkownika.**
- ✅ Gotowe gdy: typy zgodne, build przechodzi.

**Krok 6.2 — Matrix hover** (`src/scripts/matrix.ts`)
- Przenieś logikę `initMatrix()` z designu: scramble tekstu (480ms) dla `[data-matrix]`, dodatkowo deszcz znaków na fixed canvasie przyciętym do kształtu przycisku dla `[data-matrix="btn"]`.
- Jeden canvas na dokument, delegacja zdarzeń na `document`, przywracanie oryginalnego tekstu przy `mouseout`/`mousedown`, czyszczenie przy `astro:before-swap`.
- Wyłączone gdy `matchMedia('(hover: none)')` lub `prefers-reduced-motion: reduce`.
- Teksty linków nie mogą „pływać” podczas scramble'a (mono font → OK; dla Geist ustaw `font-variant-numeric`/stałą szerokość lub ogranicz efekt do elementów mono).
- ✅ Gotowe gdy: efekt działa w header, footer, przyciskach; brak wycieków po nawigacji.

**Krok 6.3 — i18n (`/pl/*`)**
- Wyłap teksty zaszyte w komponentach (`Get in touch`, `See more`, `See live`, `See case study`, `Technologies:`, `status: done/in progress`, `Send message`, komunikaty formularza, `Privacy Policy`, etykiety timeline itp.) → słownik `src/i18n/ui.ts` (`en`/`pl`) + helper `t(locale, key)`. Locale z route'a.
- ✅ Gotowe gdy: `/pl/` i `/pl/contact` nie mają angielskich stringów z kodu.

**Krok 6.4 — Sprzątanie**
- Usuń nieużywane: `src/assets/Logo*.svg`, `elipse.svg`, `polandflag.svg` (jeśli nieużywane), stare fonty, `contactBanner` (jeśli zastąpiony), `swiper`/`gsap` (jeśli nieużywane).
- Zaktualizuj `CLAUDE.md` (fonty, tokeny, nowe sekcje, env Resend, skrypty klienckie).
- ✅ Gotowe gdy: `grep` nie znajduje odwołań do usuniętych plików, build przechodzi.

**Krok 6.5 — Weryfikacja końcowa**
- `npm run build` i `npm run cf:dev`.
- Przegląd w przeglądarce na 390×844 i ~1440px, porównanie z designem dla: Home, Menu, About, Work, Case study, Certificates, Contact + `/pl/`.
- Sprawdź: brak poziomego scrolla na mobile, fokus z klawiatury (menu, lightbox, formularz, karuzela), kontrast tekstu `dim` na `bg`, nawigacja View Transitions (skrypty nie dublują się).
- ✅ Gotowe gdy: wszystkie ekrany zgodne, brak błędów w konsoli.

---

## Progress

Statusy: `⬜ todo` · `🟨 in progress` · `✅ done` · `⛔ blocked`.
Po każdym kroku: zmień status, dopisz datę i krótką notatkę (co zrobiono, odchylenia od planu, commit hash). Blokery opisz w „Notatki / blokery”.

| Krok | Opis | Status | Data | Notatka / commit |
|---|---|---|---|---|
| 0.1 | Branch + fonty Geist / JetBrains Mono | ✅ done | 2026-10-02 | Branch `redesign`; variable woff2 (latin + latin-ext, dla PL) z fontsource w `public/fonts/`, 4× `@font-face` w `global.css`. Inter i Alfa Slab One **zostawione** — nadal używane przez `--font-sans`/`--font-display`; usunięcie w 0.2/6.4. Build OK. commit f29afa9 |
| 0.2 | Tokeny i style globalne | ✅ done | 2026-10-02 | `@theme` z tokenami designu + `--container-site`; utility `bg-grid`, `clip-corner(-sm)`, `animate-blink`, `::selection`; nagłówki Geist 600/-.04em; `--font-size-h1/h2` na clampy z designu (+ `--font-size-h1-sub`), usunięte mobilne nadpisania h1/h2. Stare tokeny (`ink`, `paper`, `accent-*`) zostają jako **aliasy** na nowe, bo używa ich ~70 miejsc w starych sekcjach — usunąć w 6.4. Skala `--font-size-*` zostaje (używana). Usunięto Inter i Alfa Slab One (pliki + `@font-face`). Build OK. commit bd6131f |
| 0.3 | Komponenty bazowe (Button, Eyebrow, Tag, StatusDot, FileFrame, TabDivider) | ✅ done | 2026-10-02 | Nowe: `Eyebrow`, `Tag`, `StatusDot` (+ `statusFromCategory`), `FileFrame`, `TabDivider` (clip-path przełączany media query 760px, `from`/`to` = `bg`/`bg-alt`). Przepisane: `Button` (primary/outline, `surface`, `size`, stare propsy zachowane dla starych sekcji), `Container` (1240px + padding z tokenów, pionowy padding sekcji, **bez** dolnego marginesu), `Heading` (bez `tracking-wide`/inline line-height), `Link` (`font="mono"`, `data-matrix="link"`). `Text` bez zmian. Nowe komponenty nieużyte jeszcze nigdzie poza `Button` — pierwsze użycie w 1.x. Build OK (`astro check` nie uruchomiony — brak `@astrojs/check`). commit 1cb3920 |
| 1.1 | Header | ✅ done | 2026-10-02 | Header fixed 72px (`bg-bg/82` + blur, border `line`), logo `~/ratajczak` + kursor `animate-blink`, nav z numerami `01.`… i aktywnym linkiem (`/work/*` podświetla Work, PL obsłużony), CTA `Button size=sm` → `/contact`. `pt-[72px]` na `body`. Usunięty stary efekt „pill” przy scrollu. Tymczasowo zostaje stary przycisk „Menu” + panel poniżej 760px (breakpoint zmieniony z 768 → 760) — przepisanie w 1.2. Brak „Contact” w liście nav (zastępuje go CTA). **Na życzenie użytkownika:** po scrollu >24px zawartość headera (`.header-nav`) zwęża się z pełnej szerokości ekranu (na górze) do 1240px (transition 300ms, tylko ≥760px; pasek tła/ramka zostają pełnej szerokości); skrypt scrolla na `astro:page-load`. **Brak weryfikacji wizualnej** — rozszerzenie Chrome nie odpowiadało; sprawdzono build + HTML z dev servera. commit 3989c43 |
| 1.2 | Mobile menu | ✅ done | 2026-10-02 | Hamburger 44×44 (2 kreski, druga `acc`, animacja w „X”) zastąpił przycisk „Menu”. Panel `MobileMenu` przeniesiony **poza** `<header>` (header ma `backdrop-filter`, które robi z niego containing block dla `fixed`) — `fixed top-72px`, `bg-grid`, `$ ls ~/ratajczak`, linki 40px/600 z `00.`…, CTA pełnej szerokości + LinkedIn/GitHub/Instagram ↗ (propsy `linkedin/github/instagram` przekazane z `Layout` do `Header`). Blokada scrolla (`overflow:hidden` na `html` + `touchmove` preventDefault poza headerem), zamykanie po kliknięciu linku, Esc, resize ≥760 i `astro:before-swap`; listenery sprzątane przy każdym `astro:page-load`. Etykiety „Home”/„Get in touch” zaszyte — do i18n w 6.3. **Brak weryfikacji wizualnej/dotykowej** (build + HTML z dev servera). commit 933af89 |
| 1.3 | Footer | ✅ done | 2026-10-02 | `TabDivider label="footer.tsx"` (`from="bg"` na sztywno — dopasowanie do ostatniej sekcji w 1.4), tło `bg-alt`, grid `auto-fit minmax(min(100%,220px),1fr)`: logo `~/ratajczak` + social ↗ / `// Quick links` (`footerMenuItems` + Contact) / `// Contact` (tel, email — kolumna tylko gdy są dane), dolny pasek `© rok | Grzegorz Ratajczak` · `Poland` · `Privacy Policy`. Usunięte stare SVG-ikony/lucide w stopce. **Poprawka globalna wykryta przy okazji:** reguły elementów w `global.css` (`a`, `p`, `h*`, `body`…) były poza warstwą i nadpisywały utility Tailwinda (np. `text-[13px]` na `<a>`) — opakowane w `@layer base`; stare sekcje mogą mieć drobne różnice. Etykiety (`Quick links`, `Contact`, `Privacy Policy`) zaszyte — i18n w 6.3. **Brak weryfikacji wizualnej.** commit 2aacd0b |
| 1.4 | Rytm sekcji w PageBuilder (tła + zakładki) | ✅ done | 2026-10-02 | `getSectionLayout()` w `pageBuilder/helpers.ts`: tła `bg`/`bg-alt` naprzemiennie, pierwsza sekcja bez dividera, sekcja po `subhero` dziedziczy tło bez dividera. Każda sekcja owinięta w `<div data-surface>` z tłem i dostaje prop `surface` (sekcje go zignorują do czasu przebudowy). Etykieta zakładki: `element.tabLabel` (pole w Studio dojdzie w 6.1) → mapa `_type → nazwa` → `_type`. `TabDivider` przepisany na zmienne CSS (`--tab-from/--tab-fill`) + prop `className`; zakładka stopki dziedziczy tło ostatniej sekcji przez regułę `main:has(> [data-surface=bg-alt]:last-child) ~ .footer-tab` w `global.css`. Sprawdzone na HTML home: hero→stack.ts→about.tsx→work.tsx→certificates.tsx→footer.tsx z poprawną naprzemiennością. Uwaga: gdy ostatnia sekcja ma `bg-alt`, zakładka stopki (też `bg-alt`) jest niewidoczna (sam napis) — do oceny wizualnej. Strona projektu (`/work/*`) nie używa jeszcze tego rytmu — 4.3. **Brak weryfikacji wizualnej.** commit 33607af |
| 2.1 | Hero + efekt pisania | ✅ done | 2026-10-02 | Hero przepisany: `bg-grid`, grid `auto-fit minmax(min(100%,420px),1fr)`, `$ whoami`, H1 `clamp(56px,9vw,124px)`, linia pisania `>` + tekst + kursor 11×24, portret w `<picture>` (mobileImage jako `<source>` <760px) z narożnikami 28px `acc`, gradientem 30% i filtrem. Efekt pisania w `src/scripts/typing.ts` (62/28/1800ms; start na `astro:page-load`, timer czyszczony na `astro:before-swap`; reduced-motion i brak JS → statyczny pierwszy tekst, SSR renderuje `phrases[0]`). Usunięty stary fade subheadline. Build OK. **Brak weryfikacji wizualnej.** commit b26b838 |
| 2.2 | technologiesStack | ✅ done | 2026-10-02 | `FileFrame` `src/stack.ts` / `{N} items`, `export const stack = [` / tagi `'Nazwa'` (hover border `acc`) / `] as const;`. Nazwy z `technology.name` (SVG ikony nieużywane w nowym designie). Swiper i GSAP usunięte z tej sekcji (nadal używane w certificatesGallery, ImageGrid, Project — do usunięcia z package.json po 2.6). Build OK. **Brak weryfikacji wizualnej.** |
| 2.3 | aboutMe + ImageGrid | ✅ done | 2026-10-02 | `aboutMe`: grid `auto-fit minmax(min(100%,420px),1fr)`, `Eyebrow`, H2 `clamp(40px,6vw,72px)`, akapity 17px/1.65 `muted` (przez `RichText`; `Text` ma inline font-size, więc nadpisane `!`), `Button outline` z `surface`. `ImageGrid` przepisany: `1fr 1.15fr`, [0] 3/4 align-end, [1] 2/3 row-span-2, [2] 3/2; GSAP usunięty. Zrezygnowano ze starego `SectionHeader` w tej sekcji. Build OK. **Brak weryfikacji wizualnej.** |
| 2.4 | projectsShowcase + Project (rows / grid) | ✅ done | 2026-10-02 | `Project` ma prop `variant` (`rows` / `grid`), `index`, `total`; `projectsShowcase` czyta `layout` (fallback `rows`; pole w Studio dojdzie w 6.1) i `surface` dla `Button outline`. Rows: `FileFrame`-like ramka `{slug}.preview.png` / `01 / 04`, `StatusDot`, H3, `RichText` 16px `muted`, `Technologies:` + `Tag`, CTA primary „See live ↗” i/lub „See case study →”. Grid: karta `line`/`bg-alt`, lead = pierwszy akapit, tagi `mt-auto`, linki mono `acc`. GROQ: dodane `hasCaseStudy: count(pageBuilder) > 0` (case study tylko gdy true). GSAP usunięty z `Project`; stary przycisk `project.button` i ikony SVG technologii usunięte (poza designem). Zostają zaszyte stringi (i18n 6.3). Build OK. **Brak weryfikacji wizualnej.** |
| 2.5 | Lightbox | ✅ done | 2026-10-02 | `components/Lightbox` — natywny `<dialog>` (`showModal`, focus trap i Esc od przeglądarki), tło `rgba(5,5,7,.92)`, obraz `max-w min(1100px,100%)` / `max-h 80vh`, podpis `{title} · esc`. Jeden na stronę, dodany w `Layout`; otwierany przez `data-lightbox-src` / `data-lightbox-title` (delegacja na `document`, rejestrowana raz), zamykanie klik/Esc i na `astro:before-swap`. Nieużyty do 2.6/4.2. Build OK. **Brak weryfikacji wizualnej.** |
| 2.6 | certificatesGallery (karuzela) | ✅ done | 2026-10-02 | Nagłówek: H2 (+ opcjonalny `Eyebrow`) + strzałki ←/→ 48×48 + `Button outline` „See more”. **Zmiana na życzenie użytkownika: karuzela na Swiperze** (`swiper-container`, `slidesPerView: auto`, `spaceBetween: 12`, nawigacja strzałkami ←/→ z klasą `swiper-button-disabled`, klawiatura, grab cursor) zamiast natywnego scroll-snap; **slidy na całą szerokość ekranu** (`w-screen`, padding-inline wyrównuje pierwszą kartę do kontenera 1240px, `overflow-x-clip` na sekcji — na życzenie użytkownika); karty `flex 0 0 min(82%,380px)`, `16/10`, dolny pasek `01 Tytuł` / `.ext` (z URL assetu), Klik w kartę → `Lightbox` (`?w=2000`). Obrazki przez `?w=800&auto=format`. `swiper` zostaje w `package.json`, **`gsap` usunięty** (nigdzie nieużywany); `@lucide/astro` zostaje (używa go `contactBanner` do 5.2). Build OK. **Brak weryfikacji wizualnej.** |
| 3.1 | subhero | ✅ done | 2026-10-02 | `bg-grid`, `Eyebrow`, H1 `clamp(56px,10vw,136px)`/.92/-.05em, linia `~/{slug}` (mono 12px `dim`) + kreska 2px `acc` gdy `highlightLine`. Slug z `Astro.url.pathname` (bez prefiksu `/pl` i sufiksu `-pl`). Nie używa już `SectionHeader`/`Container`. Padding dolny subhero + sekcja po nim (ten sam `bg`, bez dividera) już obsługuje `getSectionLayout`. Build OK. **Brak weryfikacji wizualnej.** |
| 3.2 | aboutProfile (Sanity + frontend) | ✅ done | 2026-10-03 | Gotowy kod, **brak treści w Studio**. Sanity (`../portfolio_sanity`, branch `main`, **niescommitowane**): `sections/aboutProfile.ts` (pola z planu; `lead` i `facts[].body` z dekoratorem `highlight`), rejestracja w `sections/index.ts` i `pages/page.ts`, `npm run typegen` (zaktualizowane `schema.json`, `sanity.types.ts`). Front: typ `AboutProfile` dopisany ręcznie do `src/lib/sanity.types.ts` (plik ma własne dodatki, nie kopiowany w całości), projekcja `image` w `PAGE_QUERY`, wpis w `componentsMapper`, etykieta zakładki `profile.json`, `RichText` obsługuje `highlight`, sekcja `src/sections/aboutProfile/` (sticky figure `top-24` od 760px, lead, kafelki path, `<dl>` facts). Build OK. **Zostaje:** zgoda użytkownika na deploy Studio i wypełnienie treści EN+PL. |
| 3.3 | experienceTimeline (pasek + git log) | ✅ done | 2026-10-02 | Sekcja przepisana: eyebrow + H2, pasek lat 44px (segmenty absolutnie wg `period`, start = najwcześniejszy rok, koniec = bieżąca data; pierwszy wpis do „teraz”), kolory: HEAD `acc`, przeszłe dev `color-mix 55%`, support `line-strong`; oś lat (`2017`, `'18`…) liczona dynamicznie, legenda. Tooltip: CSS hover/focus + tap (`data-active`, jeden listener na `document`, sprzątanie na `astro:before-swap`). `kind` z pola Studio (`entry.kind`, dojdzie w 6.1) z fallbackiem „Support” w roli. `ExperienceTimelineCard` → wiersz `git log` (okres + `{kind} · N yrs` / rola + `@ firma` + `HEAD` + opis + `Tag`i). Usunięty IntersectionObserver i stary układ dwukolumnowy; logo wpisu nieużywane (poza designem). Sprawdzone: 6 segmentów sumuje się do 100% na `/about`. Etykiety „development/it support/yrs/HEAD” zaszyte — i18n 6.3. **Brak weryfikacji wizualnej.** |
| 3.4 | currentFocus | ✅ done | 2026-10-02 | Grid `auto-fit minmax(min(100%,400px),1fr)`, lewo H2 `clamp(36px,5vw,60px)` + opis (`RichText` 17px `muted`), prawo karta `line`/`bg-alt`: zdjęcie 16/10, `StatusDot`, H3 26px, opis projektu (pierwszy akapit `content`, fallback `description`). Bez `SectionHeader`/`Project`/`Container`. Build OK. **Brak weryfikacji wizualnej.** |
| 4.1 | Strona Work | ✅ done | 2026-10-03 | `layout: grid` opublikowany w Sanity (CLI), `/work` renderuje 4 karty w wariancie `grid`; padding grida zgodny z designem; brak `slug` w 3 projektach → etykieta pliku z tytułu. |
| 4.2 | certificatesGrid (mozaika) | ✅ done | 2026-10-02 | Mozaika `auto-fill minmax(min(100%,280px),1fr)`, gap 8px, karty jak w karuzeli (16/10, `01 Tytuł` / `.ext`, hover `acc`), klik → `Lightbox` (`?w=2000`). Padding sekcji z designu (góra `clamp(24px,4vw,48px)`, dół `clamp(64px,9vw,120px)`), opcjonalny eyebrow/H2. Usunięte: masonry, `astro:assets` `Image`, link do `certificateUrl`. Sprawdzone: 8 kart na `/certificates`. **Brak weryfikacji wizualnej.** |
| 4.3 | Case study | ✅ done | 2026-10-02 | `/work/[projectURL]` przepisany: hero `bg-grid` (`← cd ../work`, eyebrow z `subtitle`, H1, `Tag`i technologii), zdjęcie 16/9 + lead 19px (`project.content`, fallback `description`), `brief.md` (siatka 1px linii, `0N /`), `features.tsx` — wszystkie bloki pageBuildera w **jednej** sekcji (gap `clamp(56px,8vw,104px)`) zamiast naprzemiennych teł z PageBuildera. Do `PROJECT_QUERY` dodane `content` i `image` (`images[0]`) + typy. `textAndImage`: numer `// 0N` i strona (row/row-reverse) liczone z kolejności bloków tego typu — **pole `flip` ze Studio jest ignorowane**. `projectImage`, `projectTwoImages`, `richTextSection` bez własnych `Container`/paddingu, ramki `line`, zwykłe `<img>` (`?w=…&auto=format`) zamiast `astro:assets`. `projectTechnologies` nieużywany (tagi w hero) — do usunięcia w 6.4. Sprawdzone na HTML „Move with Nat”: 3 komórki briefu, 4 bloki `// 01–04` (2 odwrócone), zakładki `brief.md`/`features.tsx`. **Brak weryfikacji wizualnej.** |
| 5.1 | Endpoint `/api/contact` (Resend, bez klucza) | ✅ done | 2026-10-02 | `src/pages/api/contact.ts` — `fetch` na `https://api.resend.com/emails` (Bearer, `reply_to`, tylko `text`, CR/LF usuwane z imienia w temacie), bez SDK. Env w `astro.config.mjs` (`envField` server/secret/optional) + `.env.example` + CLAUDE.md; import z `astro:env/server`. Przyjmuje JSON i form (`urlencoded`/`multipart`); dla formularza bez JS odpowiada `303` na `/contact` lub `/pl/contact` (`locale=pl`) z `?sent=1` / `?error=<kod>`. Walidacja: name 1–100, email (format, ≤254), message 1–5000 → `400 {error:"validation", field}`; honeypot `website` → udawany sukces; brak któregokolwiek z 3 env → `503 not_configured`; błąd Resend → `502 send_failed`. Sprawdzone `curl`em na dev (JSON i form, wszystkie kody). **Nie sprawdzona ścieżka 200 z prawdziwym Resend** (brak klucza). POST bez nagłówka `Origin` z form-content-type → 403 (CSRF Astro, w przeglądarce OK). |
| 5.2 | Strona kontaktu + formularz | ✅ done | 2026-10-02 | Nowa sekcja `src/sections/contactForm/` użyta w `contact.astro` i `pl/contact.astro` razem z `subhero` (`// Get in touch` / `Contact`, `~/contact`; PL: „Skontaktuj się” / „Kontakt”) — zastępuje `contactBanner` (plik zostaje do 6.4). Lewo: `FileFrame` `contact.json` (`email`, `phone`, `location: Poland`) + `Button outline` LinkedIn/GitHub/Instagram ↗ z globali. Prawo: karta `new-message.sh` / `POST /contact`, pola `$ name/email/message` (focus border `acc`), honeypot `website`, ukryte `locale`, info o Privacy Policy, `Button primary` „Send message”. JS (`astro:page-load`, bez dubli przez `dataset.bound`): `fetch` JSON na `/api/contact`, disabled w trakcie, sukces → `$ ./new-message.sh` / `✓ 200 OK — message sent.` / `Thanks, {name}. I'll reply to {email} soon.` / `← send another`; błędy `✗ 400/502/503/network` (503 z fallbackiem na e-mail). Komunikaty budowane w frontmatterze i przekazywane w `data-messages`, więc działają też bez JS: `?sent=1` pokazuje sukces, `?error=<kod>` komunikat. Sprawdzone na HTML (/contact, /pl/contact, ?sent=1, ?error=not_configured). Stringi formularza po angielsku także na PL — i18n w 6.3. **Brak weryfikacji wizualnej ani testu submitu w przeglądarce.** |
| 6.1 | Schematy Sanity + typegen | ✅ done | 2026-10-02 | `../portfolio_sanity` (branch `main`, **niescommitowane**, nie wdrożone): `projectsShowcase.layout` (`rows`/`grid`, radio, domyślnie `rows`), `experienceTimeline.entries[].kind` (`development`/`support`, radio), `tabLabel` (string) dodany helperem `withTabLabel` w `sections/index.ts` do wszystkich sekcji **poza `hero` i `subhero`** (13 typów). `aboutProfile` — z kroku 3.2. Typegen: `schema extract --force` + `typegen generate` (skrypt `npm run typegen` pada na istniejącym `schema.json` bez `--force`). Front: pola `layout`, `kind`, `tabLabel` dopisane ręcznie do `src/lib/sanity.types.ts` (plik ma własne dodatki). GROQ już zwraca nowe pola (spread `...`), sekcje je czytają od kroków 1.4/2.4/3.3. Build OK. **Zostaje (wymaga Twojej zgody):** deploy Studio, ustawienie `layout: grid` na stronie Work, opcjonalnie `kind`/`tabLabel` w treści. |
| 6.2 | Matrix hover | ✅ done | 2026-10-02 | `src/scripts/matrix.ts` — port `initMatrix()` z designu: scramble 480ms na `[data-matrix]` (TreeWalker po węzłach tekstu, oryginały przywracane przy `mouseout`/`mousedown`), deszcz znaków na canvasie `fixed` (z-index 9998) przyciętym do kształtu przycisku (corner 14px) dla `data-matrix="btn"`. Delegacja na `document`, rejestrowana raz (`initMatrix()` w skrypcie `Layout`); `astro:before-swap` zatrzymuje efekt; canvas tworzony leniwie (`isConnected`), bo View Transitions podmieniają `body`. Wyłączone dla `(hover: none)` i `prefers-reduced-motion`. **Odchylenie od designu:** efekt startuje tylko dla elementów z fontem monospace (sprawdzenie `font-family`), żeby Geist nie „pływał” — linki z `font="sans"` są pomijane. Typy sprawdzone `tsc --strict`, build OK. **Brak weryfikacji wizualnej** (Chrome nie odpowiadał). |
| 6.3 | i18n `/pl/*` | ✅ done | 2026-10-02 | `src/i18n/ui.ts`: słowniki `en`/`pl` (typowane kluczami z `en`), `getLocale(url)` (`/pl` i `/pl/…`), `t(locale, key, vars)` z `{placeholder}`, `useTranslations(Astro.url)`, `formatYears` (en: yr/yrs, pl: rok/lata/lat z regułą 12–14). Podmienione teksty w: `Header` (+`MobileMenu`: Home→Start, Get in touch→Napisz do mnie, aria), `Footer`, `Project` (See live / See case study / Technologies:), `StatusDot` (status: ukończony / w trakcie), `ExperienceTimelineCard` + `experienceTimeline` (development/wsparcie IT, „teraz”, lata), `technologiesStack` (pozycji), `certificatesGallery`/`Grid` (aria), `Lightbox` (aria), `contactForm` (etykiety, błędy, sukces — szablon `Thanks, {name}…` przez `data-template`, bo skrypt klienta nie ma słownika). Sprawdzone na HTML: `/pl`, `/pl/about`, `/pl/contact` (+ `?error=`, `?sent=1`) bez angielskich stringów z kodu; EN bez zmian. **Pominięte:** alty zastępcze obrazów (`Project image`…), `HEAD`, nazwy plików/zakładek (`stack.ts`…), `$ ls ~/ratajczak`, `← cd ../work`, subhero kontaktu (już per-locale na stronie). Case study (`/work/*`) nadal tylko EN (brak tras PL). **Bug złapany w trakcie:** `t()` użyte w frontmatterze Headera przed deklaracją (TDZ) wywalało render całej strony (200 z pustym `<body>`) — build tego nie wykrywa. |
| 6.4 | Sprzątanie + CLAUDE.md | ✅ done | 2026-10-02 | Usunięte: cały `src/assets/` (nic z niego nie było importowane: Logo*, elipse, polandflag, ikony social), sekcje `contactBanner` i `projectTechnologies`, zależność `@lucide/astro`, aliasy starych tokenów (`ink`, `paper`, `accent-orange`, `accent-green`, `--font-display`) i opcja `font="display"` w `Link`. `technologiesOverview`, `aboutBanner` i `SectionHeader` **zostają** (typy sekcji nadal dostępne w Studio, więc mogą być w treściach), ale `technologiesOverview`/`SectionHeader` przepięte z `paper` na `fg`. Fonty Inter/Alfa Slab One usunięte już w 0.2; `gsap` w 2.6. CLAUDE.md: design system, rytm PageBuildera, case study, skrypty klienckie (+ pułapka z `t()` w frontmatterze), i18n, formularz. Sprawdzone: 10 tras renderuje `<main>` i `<footer>`, `grep` bez odwołań do usuniętych plików/tokenów. |
| 6.5 | Weryfikacja końcowa | 🟨 in progress | 2026-10-02 | **Zrobione bez przeglądarki** (Chrome z narzędzi nie odpowiadał): `npm run build` OK; `wrangler dev` (workerd) — 10 tras 200 z `<main>`/`<footer>`, `/nope` 404, `/api/contact` 503/400 jak na dev; kontrast: `dim` miał 4.09/3.90:1 → zmieniony `#71717a` → `#7c7c86` (4.79 na `bg`, 4.56 na `bg-alt`; reszta tokenów ≥ 7.3:1); fokus: dodany globalny `:focus-visible` (outline `acc`) + `focus-visible:bg-*` w `Button` (outline jest przycinany przez `clip-path`); skrypty: listenery idempotentne (guardy / `dataset.bound` / flaga w `matrix`), poziomy scroll od `w-screen` w karuzeli przycięty `overflow-x-clip`. **Zostaje (wymaga przeglądarki):** porównanie z designem na 390×844 i ~1440px (Home, Menu, About, Work, Case study, Certificates, Contact, `/pl/`), brak poziomego scrolla na mobile, ręczny test fokusu (menu, lightbox, formularz, karuzela), brak błędów w konsoli, działanie View Transitions, wygląd efektów (typing, matrix, tooltipy timeline). |

**Postęp:** 26 / 27 kroków (zostaje 6.5 — przegląd w przeglądarce)

### Notatki / blokery

- **Ikony technologii (na życzenie użytkownika):** `Tag` ma prop `svg` (ikona 14px przed nazwą); używają go `Project` (rows/grid), `ExperienceTimelineCard` i hero case study. `technologiesStack` zachowuje własne ikony pokazywane na hover.
- **Weryfikacja wizualna nie wykonana** dla kroków 1.1–1.4: rozszerzenie Chrome nie odpowiadało (2.10.2026). Sprawdzono build + HTML z dev servera; przegląd w przeglądarce (390px i ~1440px) zostaje do 6.5, a bieżące kroki ogląda użytkownik na `npm run dev`.
- **Do posprzątania w 6.4:** aliasy starych tokenów w `global.css` (`--color-ink`, `--color-paper`, `--color-accent-orange`, `--color-accent-green`, `--font-display`) oraz stary panel/etykiety zaszyte w komponentach (i18n w 6.3).
- **Zmiana globalna (1.3):** reguły elementów w `global.css` są w `@layer base` — utility Tailwinda je teraz nadpisują; stare sekcje mogą mieć drobne różnice do czasu przebudowy.
- **Do oceny wizualnej:** zakładka stopki jest niewidoczna, gdy ostatnia sekcja ma `bg-alt` (1.4).
- **Footer (na życzenie użytkownika):** zamiast linii — zakładka `footer.tsx` zawsze widoczna: stopka przełącza tło na przeciwne do ostatniej sekcji (po `bg-alt` → `bg`), reguły `:has` w `global.css` (rozwiązuje też wcześniejszą uwagę o niewidocznej zakładce).
- **Header (1.1, na życzenie użytkownika):** zawartość na górze strony na całą szerokość, po scrollu >24px zwężona do 1240px.
- `astro check` niedostępny (brak `@astrojs/check`) — typy nie są sprawdzane poza buildem.
- Commity etapów 0–1: `f29afa9`, `bd6131f`, `1cb3920`, `3989c43`, `4e19e6d`, `dd9bbdc`, `933af89`, `2aacd0b`, `33607af`.

### Do zrobienia przez użytkownika

- [ ] Założyć konto/domenę w Resend i podać `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (zweryfikowana domena), `CONTACT_TO_EMAIL`; dodać je jako sekrety Workers (`wrangler secret put …`).
- [ ] Zatwierdzić zmiany schematów Sanity i deploy Studio (krok 6.1).
- [ ] Zatwierdzić treści sekcji `aboutProfile` w Studio (krok 3.2).

- **2026-10-03:** Studio zdeployowane; treści `about` (EN, `aboutProfile` zamiast `aboutBanner`, `kind` w osi czasu), nowa `about-pl` i `work` (`layout: grid`) opublikowane przez Sanity CLI. Do zrobienia ręcznie: `translation.metadata` (about ↔ about-pl) i `global` PL z pozycją „O mnie”.

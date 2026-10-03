# Plan: strona About w Sanity (aboutProfile + treści EN/PL)

Cel: dokończyć stronę About zgodnie z designem (`.ai/design/Portfolio Redesign.dc.html`, blok `isAbout`).
Kod frontu jest gotowy (`src/sections/aboutProfile/`). Brakuje: wdrożenia schematów Studio i treści w Sanity.

> **Nic z tego planu nie jest jeszcze wykonane.** Deploy Studio i publikacja treści tylko po Twojej zgodzie.

## Stan obecny

- Studio (`../portfolio_sanity`, branch `main`) ma **niescommitowane** zmiany: `sections/aboutProfile.ts` (nowy), `sections/index.ts`, `sections/projectsShowcase.ts` (`layout`), `sections/experienceTimeline.ts` (`kind`), `pages/page.ts`, `schema.json`, `sanity.types.ts`.
- Strona EN `about` (`a7808827-37ff-4a73-af41-427e4ebf7fcd`) ma bloki: `subhero` → `aboutBanner` → `experienceTimeline` → `currentFocus`.
- Strony PL: istnieje tylko placeholder `home-pl`. **Nie ma `about-pl`**, więc `/pl/about` jest teraz 404.
- Wpisy osi czasu nie mają pola `kind`, więc front zgaduje je z roli (zawiera „Support” → wsparcie).

## Kroki

### 1. Zatwierdzenie i deploy schematów
1. Przejrzyj diff w `../portfolio_sanity` (`git diff`, `sections/aboutProfile.ts`).
2. Commit w repo Studio (np. `Add aboutProfile section, projectsShowcase.layout, timeline kind, tabLabel`).
3. Deploy Studio: `npx sanity deploy` (oraz ewentualnie `npx sanity schema deploy`, jeśli używane jest schema store).
4. ✅ Gotowe gdy: w Studio, w Page Builderze strony, można dodać blok **About profile**; w `experienceTimeline` pojawia się pole **kind**.

### 2. Strona EN `about` — zmiany
Edycja istniejącego dokumentu `about` (EN), kolejność bloków docelowo:

| # | Blok | Akcja |
|---|---|---|
| 1 | `subhero` | bez zmian (`My short story` / `About me` / highlightLine ✓) |
| 2 | `aboutProfile` | **dodaj** (copy niżej), `tabLabel` zostaw puste (fallback `profile.json`) |
| 3 | `experienceTimeline` | ustaw `kind` w każdym wpisie (niżej) |
| 4 | `currentFocus` | bez zmian |
| — | `aboutBanner` | **usuń** po zweryfikowaniu, że `aboutProfile` ma całą treść (zdjęcie `9670c3dc…jpg` jest używane ponownie) |

#### 2.1 Copy: `aboutProfile` (EN)

- **image**: to samo co w `aboutBanner` — `image-9670c3dcc324eb9f25c56c2fe773c35fa9016e36-5753x3835-jpg` (w Studio: skopiuj z `aboutBanner` przed jego usunięciem). Hotspot na twarz.
  - **alt**: `Grzegorz Ratajczak`
- **fileLabel**: `grzegorz.jpg`
- **fileMeta**: `since 2018`
- **captionTitle**: `Grzegorz Ratajczak`
- **captionSubtitle**: `frontend / fullstack` *(separator „·” dokleja komponent)*
- **lead** (Highlight na `2018`):
  > I have been working in IT since **[highlight]2018[/highlight]** and currently focus on frontend development with selected fullstack responsibilities.
- **pathLabel**: `path`
- **path**:
  1. `Technical support`
  2. `Frontend engineering`
  3. `Product development` — **isCurrent: true**
- **facts**:

| label | body | tags |
|---|---|---|
| `now` | Today, I work mainly with React and Next.js in a marketplace environment, while also handling smaller backend tasks in Java and Kotlin within Kubernetes-based systems. | `React`, `Next.js`, `Java`, `Kotlin`, `Kubernetes` (bez accent) |
| `approach` | I enjoy combining product thinking, clean implementation, and reliable delivery in real-world projects. | — |
| `education` | Bachelor of Engineering, Computer Science — CDV *(drugi akapit/linia:)* IT Technician diploma | — |
| `learning` | Most recently I completed the 10xDev course focused on applying AI in a programmer’s daily workflow. Right now, I am strongly focused on deepening my AI skills through hands-on learning and communities. | `✓ 10xDev` (**accent: true**), `AI Devs`, `AI Product Hero` |
| `offline` | Beyond work, I am also a happy husband, which gives me even more perspective, balance, and motivation in everyday life. | — |

Uwaga do `education`: w designie to dwie osobne linie (`Bachelor of Engineering, Computer Science` + szary `— CDV`, oraz `IT Technician diploma`). W Studio wpisz dwa bloki (akapity) w `body`; szary „— CDV” jest stylem designu i nie ma dekoratora — dopuszczalne uproszczenie: zwykły tekst.

#### 2.2 `experienceTimeline.entries[].kind`

| Wpis | kind |
|---|---|
| Kinguin — Frontend Engineer (2023) | `development` |
| Adchitects — JS Developer (2022-2023) | `development` |
| Codium — Fullstack Developer (2020-2022) | `development` |
| Polskie Wydawnictwo Rolnicze — Junior Front-End Developer (2019-2020) | `development` |
| NeoBank — Technical Support Specialist (2018-2019) | `support` |
| Daw-systems — IT Support Specialist (2017-2018) | `support` |

### 3. Strona PL `about-pl` (nowy dokument)

Konwencje (z `CLAUDE.md`): `language: pl`, slug `about-pl`, route `/pl/about`. Utwórz przez „Translate” w Studio (plugin document-internationalization), żeby powstał `translation.metadata` łączący EN↔PL. Strona musi też mieć `headerMenuItems`/`footerMenuItems` jak EN (wzorzec: `Home PL`).

Bloki (ta sama kolejność co EN, bez `aboutBanner`):

#### 3.1 `subhero` (PL)
- **eyebrow**: `Moja krótka historia`
- **heading**: `O mnie`
- **highlightLine**: ✓

#### 3.2 `aboutProfile` (PL)
- **image**: to samo zdjęcie, **alt**: `Grzegorz Ratajczak`
- **fileLabel**: `grzegorz.jpg` · **fileMeta**: `od 2018`
- **captionTitle**: `Grzegorz Ratajczak` · **captionSubtitle**: `frontend / fullstack`
- **lead** (Highlight na `2018`):
  > Pracuję w IT od **[highlight]2018[/highlight]** roku i obecnie skupiam się na frontendzie, z wybranymi zadaniami fullstackowymi.
- **pathLabel**: `ścieżka`
- **path**: `Wsparcie techniczne` → `Frontend engineering` → `Rozwój produktu` (**isCurrent**)
- **facts**:

| label | body | tags |
|---|---|---|
| `teraz` | Dziś pracuję głównie z React i Next.js w środowisku marketplace, a przy okazji zajmuję się mniejszymi zadaniami backendowymi w Javie i Kotlinie w systemach opartych o Kubernetes. | `React`, `Next.js`, `Java`, `Kotlin`, `Kubernetes` |
| `podejście` | Lubię łączyć myślenie produktowe, czystą implementację i niezawodne dowożenie w prawdziwych projektach. | — |
| `edukacja` | Inżynier informatyki — CDV *(linia 2:)* Technik informatyk | — |
| `nauka` | Ostatnio ukończyłem kurs 10xDev o wykorzystaniu AI w codziennej pracy programisty. Teraz mocno skupiam się na pogłębianiu umiejętności AI przez praktykę i społeczności. | `✓ 10xDev` (accent), `AI Devs`, `AI Product Hero` |
| `poza pracą` | Poza pracą jestem też szczęśliwym mężem, co daje mi jeszcze więcej perspektywy, równowagi i motywacji na co dzień. | — |

#### 3.3 `experienceTimeline` (PL)
- **eyebrow**: `Chcę się podzielić`
- **heading**: `Moja oś czasu`
- Wpisy (company, period, technologies, logo i `kind` jak w EN; tłumaczone `role` + `description`):

| Firma | role | description |
|---|---|---|
| Kinguin | Frontend Engineer | Rozwijam funkcje marketplace’u w React/Next.js i wspieram prace backendowe w Javie/Kotlinie. Pracuję w środowisku opartym o Kubernetes, z naciskiem na skalowalność i jakość na produkcji. |
| Adchitects | JS Developer | Pracowałem w stacku React/Next.js, budując aplikacje webowe i funkcje dla klientów, z naciskiem na wydajność i łatwość utrzymania. |
| Codium | Fullstack Developer | Zaczynałem jako frontend developer, awansowałem na fullstacka. Pracowałem m.in. z Vue, WordPress i Node.js, dostarczając zarówno UI, jak i funkcje backendowe. |
| Polskie Wydawnictwo Rolnicze | Junior Front-End Developer | Wszedłem w programowanie jako junior frontend developer — pracowałem przy produkcyjnych interfejsach i zbudowałem solidne podstawy technologii frontendowych. |
| NeoBank | Specjalista wsparcia technicznego | Zapewniałem wsparcie techniczne w środowisku bankowym, rozwijając umiejętności diagnozowania problemów, dbałość o szczegóły i nastawienie „najpierw niezawodność”. |
| Daw-systems | Specjalista wsparcia IT | Zacząłem karierę w IT we wsparciu operacji magazynowych — rozwiązywałem codzienne problemy techniczne i uczyłem się, jak w praktyce działają systemy krytyczne dla biznesu. |

#### 3.4 `currentFocus` (PL)
- **heading**: `Czym zajmuję się teraz?`
- **description**: `Obecnie skupiam się na budowaniu aplikacji AI w ramach kursu AI Devs.`
- **project**: ta sama referencja co w EN (`AI Devs Agent`, `d7ead361-13a7-4f3d-a18f-95fe5e1b0200`) — o ile istnieje wersja PL projektu, wskaż ją; inaczej EN (karta projektu pokaże treść EN).

### 4. Strona Work — przełącznik układu (krok 4.1 z `redesign-plan.md`)
- W dokumencie `work` (EN) w bloku `projectsShowcase` ustaw **layout = grid**.
- PL `work-pl`: nie istnieje (brak tras `/pl/work/*`) — pomiń.

### 5. Nawigacja i i18n
- Upewnij się, że `global` (header/footer) w wersji PL zawiera pozycję „O mnie” → `about-pl` (obecnie jest tylko `Global (en)`). Bez tego `/pl/about` będzie osiągalne tylko bezpośrednim URL-em.
- Sprawdź `translation.metadata` dla `about` ↔ `about-pl`.

### 6. Weryfikacja (po publikacji)
1. `npm run dev` w `portfolio_front`; **zrestartuj** serwer albo wywołaj webhook `POST /api/revalidate` (cache Sanity jest w pamięci).
2. `/about` — kolejność: subhero → `profile.json` (aboutProfile) → `git log` → `now.md`; sticky zdjęcie na ≥760px; brak starej `aboutBanner`.
3. `/pl/about` — to samo po polsku; brak angielskich stringów z kodu (i18n z 6.3).
4. Oś czasu: kolory segmentów (dev vs. support wg `kind`), tooltipy, etykiety `development` / `it support`.
5. `/work` — siatka kart (wariant `grid`).
6. Mobile 390 px: brak poziomego scrolla; zdjęcie nie sticky.
7. Aktualizacja `.ai/redesign-plan.md` (kroki 3.2, 4.1 → ✅, Progress 26/27).

## Decyzje do potwierdzenia przed startem

1. Czy tłumaczenia PL (powyżej) są OK, czy chcesz je przeredagować (zwłaszcza `Technik informatyk` / `Inżynier informatyki` i nazwy etykiet faktów)?
2. Czy usuwamy `aboutBanner` z About (tekst jest w całości przeniesiony do `aboutProfile`)?
3. Czy tworzymy `about-pl` teraz, czy zostawiamy PL na później (wtedy pomiń sekcję 3 i 5)?
4. Czy wdrażam ja (przez Studio CLI / klienta Sanity z tokenem), czy robisz to ręcznie w Studio wg tej listy?

export type Locale = "en" | "pl";

const en = {
    "nav.home": "Home",
    "nav.getInTouch": "Get in touch",
    "nav.homeAria": "Go to homepage",
    "nav.menuAria": "Menu",

    "footer.quickLinks": "Quick links",
    "footer.contact": "Contact",
    "footer.country": "Poland",
    "footer.privacy": "Privacy Policy",

    "project.seeLive": "See live",
    "project.seeCaseStudy": "See case study",
    "project.technologies": "Technologies:",
    "status.label": "status:",
    "status.done": "done",
    "status.inProgress": "in progress",

    "timeline.development": "development",
    "timeline.support": "it support",
    "timeline.now": "now",

    "stack.items": "items",

    "certificates.previous": "Previous certificate",
    "certificates.next": "Next certificate",
    "certificates.open": "Open",
    "certificates.fallback": "certificate",

    "lightbox.aria": "Image preview",

    "contact.name": "name",
    "contact.email": "email",
    "contact.message": "message",
    "contact.privacyLead": "By sending you accept the",
    "contact.send": "Send message",
    "contact.sent": "200 OK — message sent.",
    "contact.thanks": "Thanks. I'll reply as soon as I can.",
    "contact.thanksNamed": "Thanks, {name}. I'll reply to {email} soon.",
    "contact.sendAnother": "← send another",
    "contact.honeypot": "Website",
    "contact.error.validation": "✗ 400 — check the fields and try again.",
    "contact.error.invalidBody": "✗ 400 — something went wrong, try again.",
    "contact.error.notConfigured": "✗ 503 — the form isn't set up yet.",
    "contact.error.sendFailed": "✗ 502 — couldn't send the message.",
    "contact.error.network":
        "✗ network error — check your connection and try again.",
    "contact.hint.writeTo": "Write to me at {email}.",
    "contact.hint.tryAgain": "Try again or write to {email}.",
} as const;

export type UiKey = keyof typeof en;

const pl: Record<UiKey, string> = {
    "nav.home": "Start",
    "nav.getInTouch": "Napisz do mnie",
    "nav.homeAria": "Przejdź na stronę główną",
    "nav.menuAria": "Menu",

    "footer.quickLinks": "Szybkie linki",
    "footer.contact": "Kontakt",
    "footer.country": "Polska",
    "footer.privacy": "Polityka prywatności",

    "project.seeLive": "Zobacz na żywo",
    "project.seeCaseStudy": "Zobacz case study",
    "project.technologies": "Technologie:",
    "status.label": "status:",
    "status.done": "ukończony",
    "status.inProgress": "w trakcie",

    "timeline.development": "development",
    "timeline.support": "wsparcie IT",
    "timeline.now": "teraz",

    "stack.items": "pozycji",

    "certificates.previous": "Poprzedni certyfikat",
    "certificates.next": "Następny certyfikat",
    "certificates.open": "Otwórz",
    "certificates.fallback": "certyfikat",

    "lightbox.aria": "Podgląd obrazu",

    "contact.name": "imię",
    "contact.email": "email",
    "contact.message": "wiadomość",
    "contact.privacyLead": "Wysyłając, akceptujesz",
    "contact.send": "Wyślij wiadomość",
    "contact.sent": "200 OK — wiadomość wysłana.",
    "contact.thanks": "Dzięki. Odpiszę najszybciej, jak się da.",
    "contact.thanksNamed": "Dzięki, {name}. Odpiszę na {email} wkrótce.",
    "contact.sendAnother": "← wyślij kolejną",
    "contact.honeypot": "Strona www",
    "contact.error.validation": "✗ 400 — sprawdź pola i spróbuj ponownie.",
    "contact.error.invalidBody": "✗ 400 — coś poszło nie tak, spróbuj ponownie.",
    "contact.error.notConfigured": "✗ 503 — formularz nie jest jeszcze skonfigurowany.",
    "contact.error.sendFailed": "✗ 502 — nie udało się wysłać wiadomości.",
    "contact.error.network":
        "✗ błąd sieci — sprawdź połączenie i spróbuj ponownie.",
    "contact.hint.writeTo": "Napisz do mnie: {email}.",
    "contact.hint.tryAgain": "Spróbuj ponownie lub napisz na {email}.",
};

const dictionaries: Record<Locale, Record<UiKey, string>> = { en, pl };

/** `/pl` and `/pl/...` are Polish, everything else English. */
export const getLocale = (url: URL): Locale =>
    /^\/pl(\/|$)/.test(url.pathname) ? "pl" : "en";

export const t = (
    locale: Locale,
    key: UiKey,
    vars: Record<string, string> = {},
) =>
    dictionaries[locale][key].replace(
        /\{(\w+)\}/g,
        (match, name: string) => vars[name] ?? match,
    );

/** Translator bound to the locale of the current route. */
export const useTranslations = (url: URL) => {
    const locale = getLocale(url);
    return { locale, t: (key: UiKey, vars?: Record<string, string>) => t(locale, key, vars) };
};

/** "1 yr" / "3 yrs", "1 rok" / "3 lata" / "5 lat". */
export const formatYears = (locale: Locale, years: number) => {
    if (locale === "en") return `${years} ${years === 1 ? "yr" : "yrs"}`;

    const lastDigit = years % 10;
    const lastTwo = years % 100;
    const word =
        years === 1
            ? "rok"
            : lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)
              ? "lata"
              : "lat";
    return `${years} ${word}`;
};

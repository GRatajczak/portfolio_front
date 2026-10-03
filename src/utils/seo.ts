type SeoInput = {
    siteUrl?: string;
    pathname: string;
    siteName: string;
    title?: string;
    description: string;
    ogImage?: string;
    noAlternates?: boolean;
};

export type Seo = {
    title: string;
    siteName: string;
    description: string;
    canonical?: string;
    alternates: { hreflang: string; href: string }[];
};

const normalize = (pathname: string) =>
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

const stripLocale = (pathname: string) =>
    normalize(pathname.replace(/^\/pl(?=\/|$)/, "") || "/");

const withLocale = (pathname: string, locale: "en" | "pl") =>
    locale === "pl" ? (pathname === "/" ? "/pl" : `/pl${pathname}`) : pathname;

/** Title, canonical and hreflang links. Without a site URL, only the title/description are set. */
export const buildSeo = ({
    siteUrl,
    pathname,
    siteName,
    title,
    description,
    noAlternates,
}: SeoInput): Seo => {
    const base = siteUrl?.replace(/\/+$/, "");
    const path = normalize(pathname);
    const fullTitle =
        title && title !== siteName ? `${title} | ${siteName}` : siteName;

    if (!base) return { title: fullTitle, siteName, description, alternates: [] };

    const barePath = stripLocale(path);
    const hasAlternates = !noAlternates && !barePath.startsWith("/work");
    const en = `${base}${withLocale(barePath, "en")}`;
    const pl = `${base}${withLocale(barePath, "pl")}`;

    return {
        title: fullTitle,
        siteName,
        description,
        canonical: `${base}${path}`,
        alternates: hasAlternates
            ? [
                  { hreflang: "en", href: en },
                  { hreflang: "pl", href: pl },
                  { hreflang: "x-default", href: en },
              ]
            : [],
    };
};

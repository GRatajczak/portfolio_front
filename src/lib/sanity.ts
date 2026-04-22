import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { defineQuery } from "groq";
import type {
    HomePageData,
    PageData,
    PageQueryResult,
    PageSlugResult,
    PostPreview,
} from "./sanity.type";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-04-20";

export const isSanityConfigured = Boolean(projectId && dataset);
export const DEFAULT_LOCALE = "en";
export type { HomePageData, PostPreview };

export const sanityClient = isSanityConfigured
    ? createClient({
          projectId,
          dataset,
          apiVersion,
          useCdn: false,
      })
    : null;

const imageBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export const POSTS_QUERY = defineQuery(`
  *[_type == "articles" && language in [$locale, $baseLocale]]
    | order(select(language == $locale => 0, language == $baseLocale => 1, 2) asc, coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    "excerpt": coalesce(seo.metaDescription, pt::text(content[0...2])),
    publishedAt,
    readTime
  }
`);

export const PAGE_QUERY = defineQuery(`
  {
    "page": *[
      _type == "page"
      && slug.current in [$pageSlug, $fallbackPageSlug]
      && language in [$locale, $baseLocale]
    ]
      | order(
        select(slug.current == $pageSlug => 0, slug.current == $fallbackPageSlug => 1, 2) asc,
        select(language == $locale => 0, language == $baseLocale => 1, 2) asc,
        _updatedAt desc
      )[0] {
      title,
      "elements": coalesce(pageBuilder, [])[]{
        ...,
        _type == "hero" => {
          ...,
          "portraitImage": portraitImage{
            alt,
            "asset": asset->{
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          }
        },
        _type == "aboutMe" => {
          ...,
          images[]{
            _key,
            alt,
            "asset": asset->{
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          }
        },
        _type == "aboutBanner" => {
          ...,
          image{
            alt,
            "asset": asset->{
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          }
        },
        _type == "experienceTimeline" => {
          ...,
          entries[]{
            ...,
            logo{
              alt,
              "asset": asset->{
                url,
                metadata{
                  dimensions{
                    width,
                    height
                  }
                }
              }
            },
            technologies[]{
              ...,
              "technology": technology->{
                _id,
                name,
                svg
              }
            }
          }
        },
        _type == "currentFocus" => {
          ...,
          "project": project.project->{
            _id,
            title,
            category,
            description,
            projectUrl,
            content,
            "slug": slug.current,
            button{
              buttonText,
              buttonLink,
              isExternalLink
            },
            "image": images[0]{
              alt,
              "asset": asset->{
                url,
                metadata{
                  dimensions{
                    width,
                    height
                  }
                }
              }
            },
            technologies[]{
              ...,
              "technology": technology->{
                _id,
                name,
                svg
              }
            }
          }
        },
        _type == "projectsShowcase" => {
          ...,
          projects[]{
            ...,
            "project": project->{
              _id,
              title,
              category,
              description,
              projectUrl,
              content,
              "slug": slug.current,
              button{
                buttonText,
                buttonLink,
                isExternalLink
              },
              "image": images[0]{
                alt,
                "asset": asset->{
                  url,
                  metadata{
                    dimensions{
                      width,
                      height
                    }
                  }
                }
              },
              technologies[]{
                ...,
                "technology": technology->{
                  _id,
                  name,
                  svg
                }
              }
            }
          }
        },
        _type == "richTextSection" => {
          ...,
          content[]{
            ...,
            markDefs[]{
              ...,
              _type == "link" => {
                ...,
                href
              }
            }
          }
        },
        _type == "technologiesStack" => {
          ...,
          technologies[]{
            ...,
            "technology": technology->{
              _id,
              name,
              svg
            }
          }
        },
        _type == "technologiesOverview" => {
          ...,
          groups[]{
            ...,
            technologies[]{
              ...,
              "technology": technology->{
                _id,
                name,
                svg
              }
            }
          }
        },
        _type == "certificatesGallery" => {
          ...,
          certificates[]{
            _key,
            "certificate": certificate->{
              _id,
              title,
              issuer,
              certificateUrl,
              "image": image{
                alt,
                "asset": asset->{
                  url,
                  metadata{
                    dimensions{
                      width,
                      height
                    }
                  }
                }
              }
            }
          }
        },
        _type == "certificatesGrid" => {
          ...,
          certificates[]{
            _key,
            "certificate": certificate->{
              _id,
              title,
              issuer,
              certificateUrl,
              "image": image{
                alt,
                "asset": asset->{
                  url,
                  metadata{
                    dimensions{
                      width,
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "globals": *[_type == "global" && language in [$locale, $baseLocale]]
      | order(select(language == $locale => 0, language == $baseLocale => 1, 2) asc, _updatedAt desc)[0] {
      "header": header{
        menuItems[]{
          _key,
          "title": @->title,
          "slug": @->slug.current
        }
      },
      "footer": footer{
        menuItems[]{
          _key,
          "title": @->title,
          "slug": @->slug.current
        }
      },
      "facebook": coalesce(facebook, ""),
      "instagram": coalesce(instagram, ""),
      "phone": coalesce(phone, ""),
      "email": coalesce(email, ""),
      "linkedin": coalesce(linkedin, ""),
      "github": coalesce(github, "")
    }
  }
`);

export const HOME_PAGE_QUERY = PAGE_QUERY;
export const PAGE_SLUGS_QUERY = defineQuery(`
  *[
    _type == "page"
    && language in [$locale, $baseLocale]
    && defined(slug.current)
  ]
    | order(
      select(language == $locale => 0, language == $baseLocale => 1, 2) asc,
      _updatedAt desc
    ) {
    "slug": slug.current,
    language
  }
`);

export async function getPosts(
    locale = DEFAULT_LOCALE,
    baseLocale = DEFAULT_LOCALE,
) {
    if (!sanityClient) {
        return [];
    }

    try {
        return await sanityClient.fetch<PostPreview[]>(POSTS_QUERY, {
            locale,
            baseLocale,
        });
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn("[sanity] Failed to fetch posts.", error);
        }

        return [];
    }
}

export async function getHomePage(
    locale = DEFAULT_LOCALE,
    baseLocale = DEFAULT_LOCALE,
): Promise<HomePageData | null> {
    const homeSlug = locale === DEFAULT_LOCALE ? "home" : `home-${locale}`;
    const fallbackHomeSlug = "home";
    return getPageBySlug(homeSlug, locale, baseLocale, fallbackHomeSlug);
}

export async function getAboutPage(
    locale = DEFAULT_LOCALE,
    baseLocale = DEFAULT_LOCALE,
): Promise<PageData | null> {
    return getPageByRouteSlug("about", locale, baseLocale);
}

export async function getPageByRouteSlug(
    routeSlug: string,
    locale = DEFAULT_LOCALE,
    baseLocale = DEFAULT_LOCALE,
): Promise<PageData | null> {
    if (!routeSlug) {
        return null;
    }

    const localizedSlug = getLocalizedPageSlug(routeSlug, locale);
    return getPageBySlug(localizedSlug, locale, baseLocale, routeSlug);
}

export async function getPageRouteSlugs(
    locale = DEFAULT_LOCALE,
    baseLocale = DEFAULT_LOCALE,
): Promise<string[]> {
    if (!sanityClient) {
        return [];
    }

    try {
        const slugs = await sanityClient.fetch<PageSlugResult[]>(PAGE_SLUGS_QUERY, {
            locale,
            baseLocale,
        });

        const uniqueSlugs = new Set<string>();

        for (const entry of slugs) {
            if (!entry.slug) {
                continue;
            }

            const routeSlug = toRouteSlug(entry.slug, locale);

            if (!routeSlug || routeSlug === "home") {
                continue;
            }

            uniqueSlugs.add(routeSlug);
        }

        return [...uniqueSlugs];
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn("[sanity] Failed to fetch page slugs.", error);
        }

        return [];
    }
}

async function getPageBySlug(
    pageSlug: string,
    locale = DEFAULT_LOCALE,
    baseLocale = DEFAULT_LOCALE,
    fallbackPageSlug = pageSlug,
): Promise<PageData | null> {
    if (!sanityClient) {
        return null;
    }

    try {
        const data = await sanityClient.fetch<PageQueryResult>(PAGE_QUERY, {
            locale,
            baseLocale,
            pageSlug,
            fallbackPageSlug,
        });

        if (!data.page) {
            return null;
        }

        return {
            title: data.page.title,
            elements: data.page.elements ?? [],
            headerMenuItems: data.globals?.header?.menuItems ?? [],
            footerMenuItems: data.globals?.footer?.menuItems ?? [],
            facebook: data.globals?.facebook ?? "",
            instagram: data.globals?.instagram ?? "",
            phone: data.globals?.phone ?? "",
            email: data.globals?.email ?? "",
            linkedin: data.globals?.linkedin ?? "",
            github: data.globals?.github ?? "",
        };
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn(
                `[sanity] Failed to fetch page data for slug "${pageSlug}".`,
                error,
            );
        }

        return null;
    }
}

function getLocalizedPageSlug(routeSlug: string, locale: string) {
    if (locale === DEFAULT_LOCALE) {
        return routeSlug;
    }

    const localeSuffix = `-${locale}`;

    if (routeSlug.endsWith(localeSuffix)) {
        return routeSlug;
    }

    return `${routeSlug}${localeSuffix}`;
}

function toRouteSlug(pageSlug: string, locale: string) {
    if (locale === DEFAULT_LOCALE) {
        return pageSlug;
    }

    const localeSuffix = `-${locale}`;

    if (pageSlug.endsWith(localeSuffix)) {
        return pageSlug.slice(0, -localeSuffix.length);
    }

    return pageSlug;
}

export function urlFor(source: SanityImageSource) {
    return imageBuilder ? imageBuilder.image(source) : null;
}

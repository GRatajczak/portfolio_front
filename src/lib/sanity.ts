import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { defineQuery } from "groq";
import type { HomePageData, HomePageQueryResult, PostPreview } from "./sanity.type";

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

export const HOME_PAGE_QUERY = defineQuery(`
  {
    "page": *[
      _type == "page"
      && slug.current in [$homeSlug, $fallbackHomeSlug]
      && language in [$locale, $baseLocale]
    ]
      | order(
        select(slug.current == $homeSlug => 0, slug.current == $fallbackHomeSlug => 1, 2) asc,
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
        _type == "projectsShowcase" => {
          ...,
          projects[]{
            ...,
            "project": project->{
              _id,
              title,
              "slug": slug.current
            }
          }
        },
        _type == "technologiesStack" => {
          ...,
          technologies[]{
            ...,
            "technology": technology->{
              _id,
              name
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
                name
              }
            }
          }
        }
      }
    },
    "globals": *[_type == "global" && language in [$locale, $baseLocale]]
      | order(select(language == $locale => 0, language == $baseLocale => 1, 2) asc, _updatedAt desc)[0] {
      "facebook": coalesce(facebook, ""),
      "instagram": coalesce(instagram, ""),
      "phone": coalesce(phone, "")
    }
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
    if (!sanityClient) {
        return null;
    }

    try {
        const homeSlug = locale === DEFAULT_LOCALE ? "home" : `home-${locale}`;
        const fallbackHomeSlug = "home";
        const data = await sanityClient.fetch<HomePageQueryResult>(HOME_PAGE_QUERY, {
            locale,
            baseLocale,
            homeSlug,
            fallbackHomeSlug,
        });

        if (!data.page) {
            return null;
        }

        return {
            title: data.page.title,
            elements: data.page.elements ?? [],
            facebook: data.globals?.facebook ?? "",
            instagram: data.globals?.instagram ?? "",
            phone: data.globals?.phone ?? "",
        };
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn("[sanity] Failed to fetch homepage data.", error);
        }

        return null;
    }
}

export function urlFor(source: SanityImageSource) {
    return imageBuilder ? imageBuilder.image(source) : null;
}

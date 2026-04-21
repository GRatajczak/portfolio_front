import type { Articles, Page } from "./sanity.types";

export type PostPreview = Pick<
    Articles,
    "_id" | "title" | "publishedAt" | "readTime"
> & {
    slug?: string;
    excerpt?: string;
};

export type PageBuilderElement = NonNullable<Page["pageBuilder"]>[number];

export type HomePageData = {
    title?: string;
    elements: PageBuilderElement[];
    headerMenuItems: Array<{
        _key?: string;
        title?: string;
        slug?: string;
    }>;
    footerMenuItems: Array<{
        _key?: string;
        title?: string;
        slug?: string;
    }>;
    facebook: string;
    instagram: string;
    phone: string;
    email: string;
    linkedin: string;
};

export type HomePageQueryResult = {
    page?: {
        title?: string;
        elements?: PageBuilderElement[];
    };
    globals?: {
        header?: {
            menuItems?: Array<{
                _key?: string;
                title?: string;
                slug?: string;
            }>;
        };
        footer?: {
            menuItems?: Array<{
                _key?: string;
                title?: string;
                slug?: string;
            }>;
        };
        facebook?: string;
        instagram?: string;
        phone?: string;
        email?: string;
        linkedin?: string;
    };
};

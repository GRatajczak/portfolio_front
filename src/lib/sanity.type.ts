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
    facebook: string;
    instagram: string;
    phone: string;
};

export type HomePageQueryResult = {
    page?: {
        title?: string;
        elements?: PageBuilderElement[];
    };
    globals?: {
        facebook?: string;
        instagram?: string;
        phone?: string;
    };
};

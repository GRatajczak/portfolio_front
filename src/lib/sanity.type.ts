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
    github: string;
};

export type PageData = HomePageData;

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
        github?: string;
    };
};

export type PageQueryResult = HomePageQueryResult;

export type PageSlugResult = {
    slug?: string;
    language?: string;
};

export type PortableTextSpanValue = {
    _key?: string;
    _type?: "span";
    text?: string;
    marks?: string[];
};

export type PortableTextMarkDefValue = {
    _key: string;
    _type: "link";
    href?: string;
};

export type PortableTextBlockValue = {
    _key?: string;
    _type?: "block";
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    level?: number;
    children?: PortableTextSpanValue[];
    markDefs?: PortableTextMarkDefValue[];
};

export type ResolvedImageAsset = {
    url?: string;
    metadata?: {
        dimensions?: {
            width?: number;
            height?: number;
        };
    };
};

export type ResolvedImage = {
    alt?: string;
    asset?: ResolvedImageAsset;
};

export type ProjectTechnologyValue = {
    _key?: string;
    technology?: {
        _id?: string;
        _ref?: string;
        name?: string;
        svg?: string;
    };
};

export type ProjectSectionValue = {
    _key?: string;
    _type?: "section";
    title?: string;
    content?: PortableTextBlockValue[];
};

export type ProjectTextAndImageBlockValue = {
    _key?: string;
    _type: "textAndImage";
    title?: string;
    content?: PortableTextBlockValue[];
    image?: ResolvedImage;
    flip?: boolean;
};

export type ProjectImageBlockValue = {
    _key?: string;
    _type: "image";
    alt?: string;
    asset?: ResolvedImageAsset;
};

export type ProjectTwoImagesBlockValue = {
    _key?: string;
    _type: "twoImages";
    leftImage?: ResolvedImage;
    rightImage?: ResolvedImage;
};

export type ProjectRichTextSectionBlockValue = {
    _key?: string;
    _type: "richTextSection";
    content?: PortableTextBlockValue[];
};

export type ProjectPageBuilderElement =
    | ProjectTextAndImageBlockValue
    | ProjectImageBlockValue
    | ProjectTwoImagesBlockValue
    | ProjectRichTextSectionBlockValue
    | {
          _key?: string;
          _type?: string;
      };

export type ProjectDocumentData = {
    _id?: string;
    title?: string;
    subtitle?: string;
    slug?: string;
    description?: string;
    projectUrl?: string;
    sections?: ProjectSectionValue[];
    technologies?: ProjectTechnologyValue[];
    pageBuilder?: ProjectPageBuilderElement[];
};

export type ProjectGlobalsData = {
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
    github?: string;
};

export type ProjectQueryResult = {
    project?: ProjectDocumentData;
    globals?: ProjectGlobalsData;
};

export type ProjectSlugResult = {
    slug?: string;
    language?: string;
};

export type ProjectPageData = {
    project: ProjectDocumentData;
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
    github: string;
};

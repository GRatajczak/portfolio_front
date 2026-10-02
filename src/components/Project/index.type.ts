export type ProjectTechnologyItem = {
    _key?: string;
    technology?: {
        _id?: string;
        _ref?: string;
        name?: string;
        svg?: string;
    };
};

export type PortableTextSpan = {
    text?: string;
};

export type PortableTextBlock = {
    children?: PortableTextSpan[];
};

export type ProjectImage = {
    alt?: string;
    asset?: {
        url?: string;
        metadata?: {
            dimensions?: {
                width?: number;
                height?: number;
            };
        };
    };
};

export type ProjectButton = {
    buttonText?: string;
    buttonLink?: string;
    isExternalLink?: boolean;
};

export type ProjectCardData = {
    _id?: string;
    title?: string;
    slug?: string;
    category?: string;
    description?: string;
    projectUrl?: string;
    hasCaseStudy?: boolean;
    content?: PortableTextBlock[];
    button?: ProjectButton;
    image?: ProjectImage;
    technologies?: ProjectTechnologyItem[];
};

export type Props = {
    project: ProjectCardData;
    /** `rows` – home list entry, `grid` – card on the Work page. */
    variant?: "rows" | "grid";
    /** Zero-based position, used for the `01 / 04` file label. */
    index?: number;
    total?: number;
    className?: string;
};

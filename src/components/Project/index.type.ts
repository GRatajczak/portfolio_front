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
    content?: PortableTextBlock[];
    button?: ProjectButton;
    image?: ProjectImage;
    technologies?: ProjectTechnologyItem[];
};

export type Props = {
    project: ProjectCardData;
    className?: string;
};

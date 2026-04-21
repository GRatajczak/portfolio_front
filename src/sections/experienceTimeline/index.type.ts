export type PortableBlock = {
    children?: Array<{ text?: string }>;
};

export type EntryLogo = {
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

export type EntryTechnology = {
    _key?: string;
    technology?: {
        _ref?: string;
        name?: string;
        svg?: string;
    };
};

export type Entry = {
    _key?: string;
    period?: string;
    company?: string;
    role?: string;
    description?: PortableBlock[];
    technologies?: EntryTechnology[];
    logo?: EntryLogo;
};

export type Props = {
    eyebrow?: string;
    heading?: string;
    entries?: Entry[];
};

export type PortableBlock = {
    children?: Array<{ text?: string }>;
};

export type Entry = {
    _key?: string;
    period?: string;
    company?: string;
    role?: string;
    description?: PortableBlock[];
    technologies?: string[];
};

export type Props = {
    eyebrow?: string;
    heading?: string;
    entries?: Entry[];
};

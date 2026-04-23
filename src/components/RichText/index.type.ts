export type PortableTextSpan = {
    _type?: "span";
    _key?: string;
    text?: string;
    marks?: string[];
};

export type PortableTextMarkDef = {
    _key: string;
    _type: "link";
    href?: string;
};

export type PortableTextBlock = {
    _type?: "block";
    _key?: string;
    children?: PortableTextSpan[];
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: PortableTextMarkDef[];
    level?: number;
};

export type Props = {
    value?: string | PortableTextBlock[];
    className?: string;
    smallHeadings?: boolean;
};

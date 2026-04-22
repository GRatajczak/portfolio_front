export type PortableTextMarkDef = {
    _key: string;
    _type: "link";
    href?: string;
};

export type PortableTextSpan = {
    _key?: string;
    _type?: "span";
    text?: string;
    marks?: string[];
};

export type PortableTextBlock = {
    _key?: string;
    _type?: "block";
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    level?: number;
    children?: PortableTextSpan[];
    markDefs?: PortableTextMarkDef[];
};

export type Props = {
    content?: PortableTextBlock[];
};

export type PortableTextSpan = {
    text?: string;
};

export type PortableTextBlock = {
    children?: PortableTextSpan[];
};

export type ReferenceLike = {
    _id?: string;
    _ref?: string;
    name?: string;
    title?: string;
};

export type TechnologyLike = {
    technology?: ReferenceLike;
};

export type ProjectLike = {
    project?: ReferenceLike;
    overrideLabel?: string;
};

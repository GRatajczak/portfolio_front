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

export type TechnologyReferenceLike = ReferenceLike & {
    svg?: string;
};

export type TechnologyLike = {
    technology?: TechnologyReferenceLike;
};

export type ProjectLike = {
    project?: ReferenceLike;
    overrideLabel?: string;
};

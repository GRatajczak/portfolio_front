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

export type SectionSurface = "bg" | "bg-alt";

export type SectionLayout = {
    surface: SectionSurface;
    /** Surface of the previous section, set only when a divider is rendered. */
    previousSurface?: SectionSurface;
    /** Divider label; empty when no divider precedes the section. */
    tabLabel: string;
};

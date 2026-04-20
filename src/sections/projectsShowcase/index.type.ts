export type ProjectItem = {
    _key?: string;
    project?: {
        _ref?: string;
    };
    overrideLabel?: string;
};

export type SectionButton = {
    buttonText?: string;
    buttonLink?: string;
    isExternalLink?: boolean;
};

export type Props = {
    eyebrow?: string;
    heading?: string;
    projects?: ProjectItem[];
    button?: SectionButton;
};

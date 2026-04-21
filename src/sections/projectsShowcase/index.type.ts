import type { ProjectCardData } from "@/components/Project/index.type";

export type ProjectItem = {
    _key?: string;
    project?: ProjectCardData;
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

import type { PortableTextBlock } from "@/components/RichText/index.type";

export type ProfileImage = {
    alt?: string;
    asset?: {
        url?: string;
        metadata?: { dimensions?: { width?: number; height?: number } };
    };
};

export type ProfilePathStep = {
    _key?: string;
    label?: string;
    isCurrent?: boolean;
};

export type ProfileFact = {
    _key?: string;
    label?: string;
    body?: PortableTextBlock[];
    tags?: { _key?: string; text?: string; accent?: boolean }[];
};

export type Props = {
    image?: ProfileImage;
    fileLabel?: string;
    fileMeta?: string;
    captionTitle?: string;
    captionSubtitle?: string;
    lead?: PortableTextBlock[];
    pathLabel?: string;
    path?: ProfilePathStep[];
    facts?: ProfileFact[];
};

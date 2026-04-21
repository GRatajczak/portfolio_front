import type { ImageGridItem } from "@/components/ImageGrid/index.type";

export type PortableBlock = {
    children?: Array<{ text?: string }>;
};

export type AboutMeButton = {
    buttonText?: string;
    buttonLink?: string;
    isExternalLink?: boolean;
};

export type Props = {
    eyebrow?: string;
    heading?: string;
    description?: PortableBlock[];
    button?: AboutMeButton;
    images?: ImageGridItem[];
};

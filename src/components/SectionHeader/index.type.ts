import type { PortableTextBlock } from "@/components/RichText/index.type";

export type Props = {
    eyebrow?: string;
    heading?: string;
    description?: PortableTextBlock[];
    className?: string;
    hero?: boolean;
    headingAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

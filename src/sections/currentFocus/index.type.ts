import type { ProjectCardData } from "@/components/Project/index.type";

export type PortableBlock = {
    children?: Array<{ text?: string }>;
};

export type Props = {
    heading?: string;
    description?: PortableBlock[];
    project?: ProjectCardData;
};

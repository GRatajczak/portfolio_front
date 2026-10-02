import type { ProjectTextAndImageBlockValue } from "@/lib/sanity.type";

export type Props = ProjectTextAndImageBlockValue & {
    /** Label above the title, e.g. `// 01`. */
    number?: string;
    /** Puts the image on the left (every second block). */
    reverse?: boolean;
};

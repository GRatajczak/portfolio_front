import type { Entry } from "@/sections/experienceTimeline/index.type";

export type Props = {
    entry: Entry;
    isHead?: boolean;
    periodLabel: string;
    kind: "development" | "support";
    duration: string;
};

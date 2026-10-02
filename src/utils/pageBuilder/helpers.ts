import type {
    PortableTextBlock,
    SectionLayout,
    SectionSurface,
    ProjectLike,
    TechnologyLike,
} from "./helpers.type";

export function toPlainText(blocks?: PortableTextBlock[]) {
    if (!blocks || blocks.length === 0) {
        return "";
    }

    return blocks
        .map((block) => block.children?.map((child) => child.text ?? "").join("") ?? "")
        .join("\n")
        .trim();
}

export function getTechnologyLabel(item: TechnologyLike) {
    return item.technology?.name ?? item.technology?._ref ?? "Unknown technology";
}

export function getProjectLabel(item: ProjectLike) {
    return item.overrideLabel || item.project?.title || item.project?._ref || "Unknown project";
}

const TAB_LABELS: Record<string, string> = {
    technologiesStack: "stack.ts",
    technologiesOverview: "stack.ts",
    aboutMe: "about.tsx",
    aboutProfile: "profile.json",
    aboutBanner: "about.tsx",
    projectsShowcase: "work.tsx",
    certificatesGallery: "certificates.tsx",
    certificatesGrid: "certificates.tsx",
    experienceTimeline: "git log",
    currentFocus: "now.md",
    projectSectionsGrid: "brief.md",
    textAndImage: "features.tsx",
    richTextSection: "notes.md",
    image: "preview.png",
    twoImages: "preview.png",
};

/**
 * Alternates section backgrounds and decides where a tab divider goes.
 * The first section has no divider; the section after a subhero continues
 * its background without one.
 */
export function getSectionLayout(
    elements: { _type?: string; tabLabel?: unknown }[],
): SectionLayout[] {
    let surface: SectionSurface = "bg";

    return elements.map((element, index) => {
        const previous = elements[index - 1];

        if (index === 0 || previous?._type === "subhero") {
            return { surface, tabLabel: "" };
        }

        const previousSurface = surface;
        surface = surface === "bg" ? "bg-alt" : "bg";
        const type = element._type ?? "";
        const customLabel =
            typeof element.tabLabel === "string" ? element.tabLabel.trim() : "";

        return {
            surface,
            previousSurface,
            tabLabel: customLabel || TAB_LABELS[type] || type,
        };
    });
}

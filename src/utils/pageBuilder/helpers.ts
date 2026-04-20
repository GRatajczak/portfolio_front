import type {
    PortableTextBlock,
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

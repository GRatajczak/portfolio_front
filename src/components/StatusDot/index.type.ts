export type Status = "done" | "in progress";

export type Props = {
    status?: Status;
    className?: string;
};

/** Maps Sanity `project.category` (`done` | `going`) to a display status. */
export const statusFromCategory = (category?: string | null): Status =>
    category === "going" ? "in progress" : "done";

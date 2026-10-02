export type Surface = "bg" | "bg-alt";

export type Props = {
    label?: string;
    /** Background of the section above. */
    from?: Surface;
    /** Background of the section below. */
    to?: Surface;
    className?: string;
};

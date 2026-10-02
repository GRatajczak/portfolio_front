export type Props = {
    href?: string;
    label?: string;
    type?: "button" | "submit" | "reset";
    isExternal?: boolean;
    className?: string;
    /** `primary` – filled accent, `outline` – 1px bordered with clipped corners. */
    variant?: "primary" | "outline";
    /** Section background the outline button sits on (fills its inner area). */
    surface?: "bg" | "bg-alt";
    size?: "sm" | "md";
    /** Appends ↗ (external) after the label. */
    showArrowUp?: boolean;
    mobileIconOnly?: boolean;
};

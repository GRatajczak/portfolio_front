export type LinkSize =
    | "2xs"
    | "xs"
    | "sm"
    | "base"
    | "l"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";

export type LinkFont = "sans" | "display";

export type Props = {
    href?: string;
    label?: string;
    isExternal?: boolean;
    className?: string;
    size?: LinkSize;
    font?: LinkFont;
    style?: string;
};

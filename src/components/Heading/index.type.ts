export type HeadingSize =
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
    | "5xl"
    | "display";

export type Props = {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: HeadingSize;
    text?: string;
    className?: string;
    style?: string;
};

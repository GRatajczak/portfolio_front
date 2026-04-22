export type TextSize =
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

export type Props = {
    as?: "p" | "span" | "small";
    size?: TextSize;
    text?: string;
    className?: string;
    style?: string;
};

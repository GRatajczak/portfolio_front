export type PortableBlock = {
    children?: Array<{ text?: string }>;
};

export type FocusProjectButton = {
    buttonText?: string;
    buttonLink?: string;
    isExternalLink?: boolean;
};

export type FocusProject = {
    category?: string;
    title?: string;
    description?: string;
    technologies?: string[];
    button?: FocusProjectButton;
};

export type Props = {
    heading?: string;
    description?: PortableBlock[];
    project?: FocusProject;
};

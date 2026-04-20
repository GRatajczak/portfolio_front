export type TechnologyItem = {
    _key?: string;
    technology?: {
        _ref?: string;
    };
};

export type Group = {
    _key?: string;
    label?: string;
    technologies?: TechnologyItem[];
};

export type PortableBlock = {
    children?: Array<{ text?: string }>;
};

export type Props = {
    heading?: string;
    description?: PortableBlock[];
    groups?: Group[];
};

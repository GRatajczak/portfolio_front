export type TechnologyItem = {
    _key?: string;
    technology?: {
        _ref?: string;
        name?: string;
        svg?: string;
    };
};

export type Props = {
    technologies?: TechnologyItem[];
};

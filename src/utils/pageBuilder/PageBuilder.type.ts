export type PageBuilderElement = {
    _type?: string;
    _key?: string;
    [key: string]: unknown;
};

export type Props = {
    elements?: PageBuilderElement[];
    facebook?: string;
    instagram?: string;
    phone?: string;
};

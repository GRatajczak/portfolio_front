export type Certificate = {
    _key?: string;
    title?: string;
    issuer?: string;
};

export type Props = {
    eyebrow?: string;
    heading?: string;
    certificates?: Certificate[];
};

export type ImageGridItem = {
    _key?: string;
    alt?: string;
    asset?: {
        url?: string;
        metadata?: {
            dimensions?: {
                width?: number;
                height?: number;
            };
        };
    };
};

export type Props = {
    images?: ImageGridItem[];
    className?: string;
};

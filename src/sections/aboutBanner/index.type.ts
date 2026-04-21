export type AboutBannerImage = {
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
    title?: string;
    description?: string;
    image?: AboutBannerImage;
};

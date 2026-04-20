export type SubheadlineItem = {
    text?: string;
};

export type HeroImage = {
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
    headline?: string;
    subheadline?: SubheadlineItem[];
    portraitImage?: HeroImage;
    facebook?: string;
    instagram?: string;
    phone?: string;
};

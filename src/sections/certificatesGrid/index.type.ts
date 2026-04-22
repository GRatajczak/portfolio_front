import type { Certificate as SanityCertificate } from "@/lib/sanity.types";

export type CertificateImage = {
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

export type CertificateData = Pick<
    SanityCertificate,
    "_id" | "title" | "issuer" | "certificateUrl"
> & {
    image?: CertificateImage;
};

export type CertificateItem = {
    _key?: string;
    certificate?: CertificateData;
} & Partial<CertificateData>;

export type Props = {
    eyebrow?: string;
    heading?: string;
    certificates?: CertificateItem[];
};

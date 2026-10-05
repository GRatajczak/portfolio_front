import type { HeaderMenuItem } from "@/components/Header/index.type";
import type { FooterMenuItem } from "@/components/Footer/index.type";

export type Props = {
    title?: string;
    description?: string;
    ogImage?: string;
    noindex?: boolean;
    /** Skip hreflang for routes that exist in one language only. */
    noAlternates?: boolean;
    hideFooter?: boolean;
    headerMenuItems?: HeaderMenuItem[];
    footerMenuItems?: FooterMenuItem[];
    phone?: string;
    email?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
};

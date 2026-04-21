import type { HeaderMenuItem } from "@/components/Header/index.type";
import type { FooterMenuItem } from "@/components/Footer/index.type";

export type Props = {
    headerMenuItems?: HeaderMenuItem[];
    footerMenuItems?: FooterMenuItem[];
    phone?: string;
    email?: string;
    instagram?: string;
    linkedin?: string;
};

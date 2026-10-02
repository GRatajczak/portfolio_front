export type MobileMenuItem = {
    title: string;
    href: string;
    active?: boolean;
};

export type MobileMenuSocial = {
    label: string;
    href: string;
};

export type Props = {
    menuItems: MobileMenuItem[];
    contactHref: string;
    socials?: MobileMenuSocial[];
};

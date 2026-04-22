export type MobileMenuItem = {
    title: string;
    href: string;
};

export type Props = {
    homeHref: string;
    menuItems: MobileMenuItem[];
    contactHref: string;
};

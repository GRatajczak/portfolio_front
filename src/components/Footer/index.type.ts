export type FooterMenuItem = {
    _key?: string;
    title?: string;
    slug?: string;
};

export type Props = {
    menuItems?: FooterMenuItem[];
    phone?: string;
    email?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
};

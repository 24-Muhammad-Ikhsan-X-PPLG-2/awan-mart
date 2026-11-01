import {
    Cable,
    Gamepad2,
    Headphones,
    Laptop,
    Monitor,
    Smartphone,
} from "lucide-react";

type NavLinkType = {
    display: string;
    href: string;
};

export const navlinks: NavLinkType[] = [
    { display: "Beranda", href: "/" },
    { display: "Kategori", href: "/categories" },
    { display: "Tentang Kami", href: "/about" },
    { display: "Bantuan", href: "/help" },
];

export const categories = [
    { name: "Laptop", href: "/categories/laptop", Icon: Laptop },
    { name: "Smartphone", href: "/categories/smartphone", Icon: Smartphone },
    {
        name: "Komputer & Komponen",
        href: "/categories/computer",
        Icon: Monitor,
    },
    { name: "Audio", href: "/categories/audio", Icon: Headphones },
    { name: "Gaming", href: "/categories/gaming", Icon: Gamepad2 },
    { name: "Aksesori", href: "/categories/accessories", Icon: Cable },
];

export const appName = import.meta.env.VITE_APP_NAME;

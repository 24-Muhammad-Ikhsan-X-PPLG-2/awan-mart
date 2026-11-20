import { Link } from "@inertiajs/react";
import {
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Package,
    ShoppingBag,
    Store,
    Tag,
    Truck,
    Users,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardProps } from "../types";
import { getInitials } from "../formatters";

export type AdminSection =
    | "dashboard"
    | "products"
    | "categories"
    | "orders"
    | "customers"
    | "suppliers"
    | "couriers"
    | "procurements";

const navigation: Array<{
    label: string;
    href?: string;
    icon: LucideIcon;
    section?: AdminSection;
}> = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        section: "dashboard",
    },
    {
        label: "Produk",
        href: "/admin/products",
        icon: Package,
        section: "products",
    },
    {
        label: "Kategori",
        href: "/admin/categories",
        icon: Tag,
        section: "categories",
    },
    {
        label: "Pesanan",
        href: "/admin/orders",
        icon: ShoppingBag,
        section: "orders",
    },
    {
        label: "Pelanggan",
        href: "/admin/customers",
        icon: Users,
        section: "customers",
    },
    {
        label: "Supplier",
        href: "/admin/suppliers",
        icon: Store,
        section: "suppliers",
    },
    {
        label: "Kurir",
        href: "/admin/couriers",
        icon: Truck,
        section: "couriers",
    },
    {
        label: "Pengadaan",
        href: "/admin/procurements",
        icon: ClipboardList,
        section: "procurements",
    },
];

type Props = {
    admin: DashboardProps["admin"];
    mobileOpen: boolean;
    onClose: () => void;
    activePage?: AdminSection;
};

const AdminSidebar = ({
    admin,
    mobileOpen,
    onClose,
    activePage = "dashboard",
}: Props) => (
    <>
        {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
                <button
                    type="button"
                    aria-label="Tutup menu navigasi"
                    onClick={onClose}
                    className="absolute inset-0 bg-[#15243A]/40"
                />
                <SidebarPanel
                    admin={admin}
                    mobile
                    onClose={onClose}
                    activePage={activePage}
                />
            </div>
        )}
        <SidebarPanel admin={admin} activePage={activePage} />
    </>
);

const SidebarPanel = ({
    admin,
    mobile = false,
    onClose,
    activePage = "dashboard",
}: {
    admin: DashboardProps["admin"];
    mobile?: boolean;
    onClose?: () => void;
    activePage?: AdminSection;
}) => (
    <aside
        className={`${
            mobile
                ? "absolute inset-y-0 left-0 flex w-[min(290px,85vw)] flex-col shadow-2xl"
                : "sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r border-[#E6E9EF] lg:flex"
        } bg-white`}
    >
        {mobile && (
            <button
                type="button"
                aria-label="Tutup menu navigasi"
                onClick={onClose}
                className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F3F5F8]"
            >
                <X size={18} />
            </button>
        )}
        <Link
            href="/admin"
            onClick={onClose}
            className="flex h-[76px] items-center gap-3 border-b border-[#EEF0F4] px-6"
        >
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#203452] text-white">
                <ShoppingBag size={18} strokeWidth={1.8} />
            </span>
            <span>
                <span className="font-playfair block text-[19px] leading-5 font-semibold tracking-tight text-[#203452]">
                    AwanMart
                </span>
                <span className="mt-1 block text-[9px] font-semibold tracking-[0.16em] text-[#8A95A5]">
                    ADMIN PANEL
                </span>
            </span>
        </Link>

        <div className="flex-1 px-3 py-6">
            <p className="mb-2 px-3 text-[9px] font-semibold tracking-[0.18em] text-[#A0A9B6]">
                MENU UTAMA
            </p>
            <nav aria-label="Navigasi admin" className="space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = item.section === activePage;

                    return item.href ? (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            aria-current={active ? "page" : undefined}
                            className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors ${
                                active
                                    ? "bg-[#EEF2F8] text-[#203452]"
                                    : "text-[#6F7B8D] hover:bg-[#F8F9FC] hover:text-[#203452]"
                            }`}
                        >
                            <Icon
                                size={17}
                                strokeWidth={active ? 2 : 1.8}
                                className={
                                    active ? "text-[#203452]" : "text-[#8792A2]"
                                }
                            />
                            {item.label}
                            {active && (
                                <span className="ml-auto size-1.5 rounded-full bg-[#203452]" />
                            )}
                        </Link>
                    ) : (
                        <div
                            key={item.label}
                            aria-disabled="true"
                            title="Halaman pengelolaan belum tersedia"
                            className="flex min-h-10 cursor-not-allowed items-center gap-3 rounded-lg px-3 text-xs font-medium text-[#A2AAB6]"
                        >
                            <Icon size={17} strokeWidth={1.8} />
                            {item.label}
                        </div>
                    );
                })}
            </nav>
            <div className="mx-3 mt-6 border-t border-[#EEF0F4]" />
            <p className="mx-3 mt-5 text-[10px] leading-5 text-[#98A2B3]">
                Kelola toko dan pantau performa AwanMart dalam satu tempat.
            </p>
        </div>

        <div className="border-t border-[#EEF0F4] p-4">
            <div className="flex items-center gap-3 rounded-lg bg-[#F8F9FC] px-3 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E4EAF2] text-xs font-semibold text-[#203452]">
                    {getInitials(admin.name)}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-[#344054]">
                        {admin.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] text-[#8A95A5]">
                        Administrator
                    </span>
                </span>
                <Link
                    href="/auth/logout"
                    aria-label="Keluar"
                    title="Keluar"
                    className="flex size-8 shrink-0 items-center justify-center rounded-md text-[#8994A3] transition-colors hover:bg-white hover:text-[#203452]"
                >
                    <LogOut size={15} />
                </Link>
            </div>
        </div>
    </aside>
);

export default AdminSidebar;

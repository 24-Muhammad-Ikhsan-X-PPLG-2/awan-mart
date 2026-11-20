import { Link } from '@inertiajs/react';
import { ClipboardList, LogOut, PackageCheck, ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SupplierProfile } from '../types';

const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toLocaleUpperCase('id-ID'))
        .join('') || 'AW';

const SupplierLayout = ({
    supplier,
    title,
    description,
    children,
}: {
    supplier: SupplierProfile;
    title: string;
    description: string;
    children: ReactNode;
}) => (
    <div className="min-h-screen bg-[#FAFAF9] text-[#292524]">
        <header className="border-b border-[#E7E5E4] bg-white">
            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/supplier/procurements"
                    className="flex items-center gap-3"
                >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#F97316]">
                        <ShoppingBag size={20} strokeWidth={2} />
                    </span>
                    <span>
                        <span className="block text-base leading-5 font-semibold tracking-tight text-[#292524]">
                            AwanMart
                        </span>
                        <span className="mt-1 block text-[10px] font-semibold tracking-[0.14em] text-[#F97316]">
                            SUPPLIER PORTAL
                        </span>
                    </span>
                </Link>
                <div className="flex items-center gap-3 sm:gap-5">
                    <Link
                        href="/supplier/procurements"
                        aria-current="page"
                        className="hidden items-center gap-2 rounded-lg bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#EA580C] sm:inline-flex"
                    >
                        <ClipboardList size={15} />
                        Permintaan Pengadaan
                    </Link>
                    {supplier.isCourier && (
                        <Link
                            href="/supplier/deliveries"
                            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#78716C] hover:bg-[#FFF7ED] hover:text-[#EA580C] sm:inline-flex"
                        >
                            <PackageCheck size={15} />
                            Pengiriman Pesanan
                        </Link>
                    )}
                    <span className="hidden h-8 w-px bg-[#E7E5E4] sm:block" />
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#FFEDD5] text-xs font-semibold text-[#C2410C]">
                        {initials(supplier.name)}
                    </span>
                    <span className="hidden min-w-0 sm:block">
                        <span className="block max-w-40 truncate text-xs font-semibold text-[#44403C]">
                            {supplier.name}
                        </span>
                        <span className="block max-w-40 truncate text-[10px] text-[#78716C]">
                            {supplier.email}
                        </span>
                    </span>
                    <Link
                        href="/auth/logout"
                        aria-label="Keluar"
                        title="Keluar"
                        className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E4] text-[#78716C] transition hover:border-[#FDBA74] hover:bg-[#FFF7ED] hover:text-[#EA580C]"
                    >
                        <LogOut size={16} />
                    </Link>
                </div>
            </div>
            <nav
                aria-label="Navigasi supplier"
                className="border-t border-[#F5F5F4] px-4 py-2 sm:hidden"
            >
                <Link
                    href="/supplier/procurements"
                    aria-current="page"
                    className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#EA580C]"
                >
                    <ClipboardList size={15} />
                    Permintaan Pengadaan
                </Link>
                {supplier.isCourier && (
                    <Link
                        href="/supplier/deliveries"
                        className="ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#78716C] hover:text-[#EA580C]"
                    >
                        <PackageCheck size={15} />
                        Pengiriman Pesanan
                    </Link>
                )}
            </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
            <div className="mb-7">
                <h1 className="text-2xl font-semibold tracking-tight text-[#292524] sm:text-[28px]">
                    {title}
                </h1>
                <p className="mt-1.5 text-sm leading-6 text-[#78716C]">
                    {description}
                </p>
            </div>
            {children}
        </main>
    </div>
);

export default SupplierLayout;

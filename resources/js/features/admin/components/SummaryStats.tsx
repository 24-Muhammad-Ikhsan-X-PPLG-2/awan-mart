import { Boxes, CircleDollarSign, ShoppingBag, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DashboardProps } from '../types';
import { formatCurrency, formatNumber } from '../formatters';

const SummaryStats = ({ stats }: { stats: DashboardProps['stats'] }) => {
    const cards: Array<{
        label: string;
        value: string;
        note: string;
        icon: LucideIcon;
    }> = [
        {
            label: 'Total pendapatan',
            value: formatCurrency(stats.revenue),
            note: 'Dari pembayaran berhasil',
            icon: CircleDollarSign,
        },
        {
            label: 'Total pesanan',
            value: formatNumber(stats.orders),
            note: 'Seluruh status pesanan',
            icon: ShoppingBag,
        },
        {
            label: 'Total produk',
            value: formatNumber(stats.products),
            note: 'Produk terdaftar',
            icon: Boxes,
        },
        {
            label: 'Total pelanggan',
            value: formatNumber(stats.customers),
            note: 'Akun pelanggan',
            icon: Users,
        },
    ];

    return (
        <section
            aria-label="Ringkasan statistik"
            className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
            {cards.map(({ label, value, note, icon: Icon }) => (
                <article
                    key={label}
                    className="rounded-xl border border-[#E5E8EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-medium text-[#778396]">
                            {label}
                        </p>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F5F8] text-[#526B91]">
                            <Icon size={18} strokeWidth={1.8} />
                        </span>
                    </div>
                    <p className="mt-3 truncate text-[23px] leading-none font-semibold tracking-tight text-[#203452] sm:text-[25px]">
                        {value}
                    </p>
                    <p className="mt-2 text-[10px] text-[#98A2B3]">{note}</p>
                </article>
            ))}
        </section>
    );
};

export default SummaryStats;

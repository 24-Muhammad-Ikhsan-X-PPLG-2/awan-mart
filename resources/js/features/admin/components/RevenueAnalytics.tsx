import { router } from '@inertiajs/react';
import RevenueChart from './RevenueChart';
import { SectionHeading } from './DashboardPrimitives';
import type { DashboardProps, DashboardRange } from '../types';

const ranges: Array<{ value: DashboardRange; label: string }> = [
    { value: '7d', label: '7 hari' },
    { value: '30d', label: '30 hari' },
    { value: '12m', label: '12 bulan' },
];

const RevenueAnalytics = ({
    data,
    range,
}: {
    data: DashboardProps['revenueTrend'];
    range: DashboardRange;
}) => {
    const changeRange = (nextRange: DashboardRange) => {
        router.get(
            '/admin',
            { range: nextRange },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                <SectionHeading
                    eyebrow="KINERJA TOKO"
                    title="Tren pendapatan"
                    description="Akumulasi dari transaksi dengan pembayaran berhasil."
                />
                <div
                    aria-label="Rentang waktu grafik"
                    className="flex items-center gap-1 rounded-lg bg-[#F8F9FC] p-1"
                >
                    {ranges.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={range === value}
                            onClick={() => changeRange(value)}
                            className={`min-h-8 rounded-md px-2.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#526B91] ${
                                range === value
                                    ? 'bg-white text-[#203452] shadow-sm'
                                    : 'text-[#7B8798] hover:text-[#203452]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <RevenueChart data={data} range={range} />
        </section>
    );
};

export default RevenueAnalytics;

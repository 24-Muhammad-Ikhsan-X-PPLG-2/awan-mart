import {
    ClipboardList,
    Clock3,
    CheckCircle2,
    PackageCheck,
} from 'lucide-react';
import { formatNumber } from '../formatters';

const statsConfig = [
    { key: 'total', label: 'Total pengadaan', icon: ClipboardList },
    { key: 'pending', label: 'Menunggu', icon: Clock3 },
    { key: 'approved', label: 'Disetujui', icon: PackageCheck },
    { key: 'completed', label: 'Selesai', icon: CheckCircle2 },
] as const;

const ProcurementStats = ({
    stats,
}: {
    stats: {
        total: number;
        pending: number;
        approved: number;
        completed: number;
    };
}) => (
    <section
        aria-label="Statistik pengadaan"
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
        {statsConfig.map(({ key, label, icon: Icon }) => (
            <article
                key={key}
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
                <p className="mt-3 text-2xl leading-none font-semibold tracking-tight text-[#203452]">
                    {formatNumber(stats[key])}
                </p>
            </article>
        ))}
    </section>
);

export default ProcurementStats;

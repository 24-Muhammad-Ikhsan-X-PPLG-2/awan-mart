import { ClipboardList, Truck } from 'lucide-react';
import { CountTile, EmptyState, SectionHeading } from './DashboardPrimitives';
import type { DashboardProps, ProcurementStatusValue } from '../types';
import { formatDate } from '../formatters';

const statusLabels: Record<ProcurementStatusValue, string> = {
    pending: 'Menunggu respons',
    approved: 'Diterima / diproses',
    rejected: 'Ditolak',
    shipped: 'Dikirim',
    completed: 'Selesai',
};

const statusClasses: Record<ProcurementStatusValue, string> = {
    pending: 'bg-[#F8F3E8] text-[#92733B]',
    approved: 'bg-[#EEF2F8] text-[#526B91]',
    rejected: 'bg-[#F9F1EF] text-[#9A5E50]',
    shipped: 'bg-[#F3EEFA] text-[#71529B]',
    completed: 'bg-[#EDF4EF] text-[#557963]',
};

const ProcurementOverview = ({
    procurements,
}: {
    procurements: DashboardProps['procurements'];
}) => (
    <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
            <SectionHeading
                eyebrow="RANTAI PASOK"
                title="Ringkasan pengadaan"
                description="Status pengadaan supplier."
            />
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F5F8] text-[#526B91]">
                <Truck size={17} />
            </span>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <CountTile label="Total" value={procurements.total} />
            <CountTile label="Menunggu" value={procurements.pending} />
            <CountTile label="Diterima" value={procurements.approved} />
            <CountTile label="Selesai" value={procurements.completed} />
        </div>
        {procurements.recent.length ? (
            <div className="border-t border-[#EEF0F4] pt-3">
                <p className="mb-1 text-[10px] font-semibold tracking-[0.08em] text-[#98A2B3]">
                    PEMBARUAN TERAKHIR
                </p>
                <ul className="divide-y divide-[#F0F2F5]">
                    {procurements.recent.map((procurement) => (
                        <li
                            key={procurement.id}
                            className="flex items-center justify-between gap-3 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-[#36465C]">
                                    {procurement.supplier}
                                </p>
                                <p className="mt-1 text-[10px] text-[#98A2B3]">
                                    {formatDate(procurement.date)}
                                </p>
                            </div>
                            <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses[procurement.status]}`}
                            >
                                {statusLabels[procurement.status]}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <EmptyState
                icon={ClipboardList}
                title="Belum ada pengadaan"
                description="Data pengadaan supplier akan tampil di sini."
                compact
            />
        )}
    </section>
);

export default ProcurementOverview;

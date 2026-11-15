import { Search, X } from 'lucide-react';
import type { ProcurementManagementProps, ProcurementStatus } from '../types';

const statusLabels: Record<ProcurementStatus, string> = {
    pending: 'Menunggu respons',
    approved: 'Diterima / diproses',
    rejected: 'Ditolak',
    shipped: 'Dikirim',
    completed: 'Selesai',
};

const ProcurementFilters = ({
    filters,
}: {
    filters: ProcurementManagementProps['filters'];
}) => (
    <form
        method="get"
        action="/admin/procurements"
        className="grid gap-3 border-b border-[#EEF0F4] px-4 py-4 sm:grid-cols-2 sm:px-5 xl:grid-cols-[minmax(230px,1fr)_170px_155px_155px_auto_auto]"
    >
        <label className="relative min-w-0">
            <span className="sr-only">
                Cari nomor pengadaan atau nama supplier
            </span>
            <Search
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]"
            />
            <input
                type="search"
                name="search"
                defaultValue={filters.search}
                placeholder="Nomor pengadaan atau supplier..."
                className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white pr-9 pl-9 text-xs text-[#344054] transition outline-none placeholder:text-[#A0A9B6] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
            />
        </label>
        <label>
            <span className="sr-only">Filter status</span>
            <select
                name="status"
                defaultValue={filters.status ?? ''}
                className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#526072] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
            >
                <option value="">Semua status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </label>
        <label>
            <span className="sr-only">Tanggal mulai</span>
            <input
                type="date"
                name="date_from"
                aria-label="Tanggal mulai"
                defaultValue={filters.dateFrom}
                className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#526072] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
            />
        </label>
        <label>
            <span className="sr-only">Tanggal akhir</span>
            <input
                type="date"
                name="date_to"
                aria-label="Tanggal akhir"
                defaultValue={filters.dateTo}
                className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#526072] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
            />
        </label>
        <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
        >
            <Search size={14} />
            Terapkan
        </button>
        {(filters.search ||
            filters.status ||
            filters.dateFrom ||
            filters.dateTo) && (
            <a
                href="/admin/procurements"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#E2E6ED] px-3 text-xs font-medium text-[#667085] transition hover:bg-[#F8F9FC]"
            >
                <X size={14} />
                Reset
            </a>
        )}
    </form>
);

export default ProcurementFilters;

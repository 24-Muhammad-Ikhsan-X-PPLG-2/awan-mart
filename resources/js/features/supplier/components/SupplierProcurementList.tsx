import { Link, router } from '@inertiajs/react';
import { Package, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import SupplierStatusBadge from './SupplierStatusBadge';
import type {
    SupplierProcurementIndexProps,
    SupplierProcurementStatus,
} from '../types';

const statusLabels: Record<SupplierProcurementStatus, string> = {
    pending: 'Menunggu respons',
    approved: 'Diterima / diproses',
    rejected: 'Ditolak',
    shipped: 'Dikirim',
    completed: 'Selesai',
};

const numberFormat = new Intl.NumberFormat('id-ID');
const currencyFormat = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

const SupplierProcurementList = ({
    filters,
    statusCounts,
    procurements,
}: Pick<
    SupplierProcurementIndexProps,
    'filters' | 'statusCounts' | 'procurements'
>) => {
    const [search, setSearch] = useState(filters.search);
    const currentCount = (status: SupplierProcurementStatus) =>
        statusCounts.find((item) => item.value === status)?.count ?? 0;
    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            '/supplier/procurements',
            { search, status: filters.status ?? '' },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-[0_2px_8px_rgba(41,37,36,0.03)]">
            <div className="border-b border-[#F0EEEC] p-4 sm:p-5">
                <form
                    onSubmit={submitSearch}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <label className="relative min-w-0 flex-1">
                        <span className="sr-only">Cari nomor pengadaan</span>
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#A8A29E]"
                        />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nomor pengadaan..."
                            className="h-10 w-full rounded-lg border border-[#E7E5E4] bg-white pr-3 pl-9 text-xs text-[#292524] transition outline-none placeholder:text-[#A8A29E] focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]/60"
                        />
                    </label>
                    <button
                        type="submit"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 text-xs font-semibold text-white transition hover:bg-[#EA580C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                    >
                        <Search size={14} />
                        Cari
                    </button>
                </form>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    <FilterLink
                        label="Semua"
                        count={statusCounts.reduce(
                            (total, status) => total + status.count,
                            0,
                        )}
                        active={!filters.status}
                        href="/supplier/procurements"
                        search={filters.search}
                    />
                    {statusCounts.map(({ value, count }) => (
                        <FilterLink
                            key={value}
                            label={statusLabels[value]}
                            count={count}
                            active={filters.status === value}
                            href={`/supplier/procurements?status=${value}`}
                            search={filters.search}
                        />
                    ))}
                </div>
            </div>

            {procurements.data.length > 0 ? (
                <>
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#FAFAF9] text-[9px] font-semibold tracking-[0.12em] text-[#A8A29E]">
                                <tr>
                                    <th className="px-5 py-3">PENGADAAN</th>
                                    <th className="px-4 py-3">TANGGAL</th>
                                    <th className="px-4 py-3">PRODUK</th>
                                    <th className="px-4 py-3">NILAI</th>
                                    <th className="px-4 py-3">STATUS</th>
                                    <th className="px-5 py-3 text-right">
                                        AKSI
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F4]">
                                {procurements.data.map((procurement) => (
                                    <tr
                                        key={procurement.id}
                                        className="transition hover:bg-[#FFFCF9]"
                                    >
                                        <th
                                            scope="row"
                                            className="px-5 py-4 text-xs font-semibold text-[#292524]"
                                        >
                                            {procurement.number}
                                            <span className="mt-1 block text-[10px] font-normal text-[#A8A29E]">
                                                {numberFormat.format(
                                                    procurement.totalQuantity,
                                                )}{' '}
                                                unit
                                            </span>
                                        </th>
                                        <td className="px-4 py-4 text-xs text-[#78716C]">
                                            {dateFormat.format(
                                                new Date(procurement.date),
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-[#57534E]">
                                            {numberFormat.format(
                                                procurement.itemsCount,
                                            )}{' '}
                                            jenis
                                        </td>
                                        <td className="px-4 py-4 text-xs font-medium whitespace-nowrap text-[#44403C]">
                                            {currencyFormat.format(
                                                procurement.totalCost,
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <SupplierStatusBadge
                                                status={procurement.status}
                                            />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={`/supplier/procurements/${procurement.id}`}
                                                className="text-xs font-semibold text-[#EA580C] hover:text-[#C2410C]"
                                            >
                                                Lihat detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="divide-y divide-[#F5F5F4] md:hidden">
                        {procurements.data.map((procurement) => (
                            <article
                                key={procurement.id}
                                className="space-y-3 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#292524]">
                                            {procurement.number}
                                        </h3>
                                        <p className="mt-1 text-[11px] text-[#78716C]">
                                            {dateFormat.format(
                                                new Date(procurement.date),
                                            )}
                                        </p>
                                    </div>
                                    <SupplierStatusBadge
                                        status={procurement.status}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-[#78716C]">
                                        {numberFormat.format(
                                            procurement.itemsCount,
                                        )}{' '}
                                        jenis ·{' '}
                                        {numberFormat.format(
                                            procurement.totalQuantity,
                                        )}{' '}
                                        unit
                                    </span>
                                    <span className="font-semibold text-[#44403C]">
                                        {currencyFormat.format(
                                            procurement.totalCost,
                                        )}
                                    </span>
                                </div>
                                <Link
                                    href={`/supplier/procurements/${procurement.id}`}
                                    className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#FED7AA] text-xs font-semibold text-[#EA580C] hover:bg-[#FFF7ED]"
                                >
                                    Lihat detail
                                </Link>
                            </article>
                        ))}
                    </div>
                </>
            ) : (
                <div className="px-5 py-14 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#F97316]">
                        {filters.search || filters.status ? (
                            <Search size={21} />
                        ) : (
                            <Package size={21} />
                        )}
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-[#44403C]">
                        {filters.search || filters.status
                            ? 'Permintaan tidak ditemukan'
                            : 'Belum ada permintaan pengadaan'}
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#78716C]">
                        {filters.search || filters.status
                            ? 'Coba ubah pencarian atau filter status.'
                            : 'Permintaan dari AwanMart akan muncul di halaman ini.'}
                    </p>
                </div>
            )}

            {procurements.last_page > 1 && (
                <div className="flex flex-col gap-3 border-t border-[#F0EEEC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-[11px] text-[#78716C]">
                        Menampilkan {procurements.from ?? 0}–
                        {procurements.to ?? 0} dari {procurements.total}
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {procurements.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? '#'}
                                preserveScroll
                                aria-disabled={!link.url}
                                aria-current={link.active ? 'page' : undefined}
                                className={`flex min-h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] ${
                                    link.active
                                        ? 'bg-[#F97316] font-semibold text-white'
                                        : link.url
                                          ? 'text-[#78716C] hover:bg-[#FFF7ED] hover:text-[#EA580C]'
                                          : 'cursor-not-allowed text-[#D6D3D1]'
                                }`}
                                onClick={(event) => {
                                    if (!link.url) event.preventDefault();
                                }}
                            >
                                {link.label
                                    .replace('&laquo; Previous', '‹')
                                    .replace('Next &raquo;', '›')
                                    .replace(/<[^>]*>/g, '')}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

const FilterLink = ({
    label,
    count,
    active,
    href,
    search,
}: {
    label: string;
    count: number;
    active: boolean;
    href: string;
    search: string;
}) => {
    const separator = href.includes('?') ? '&' : '?';
    const target = search
        ? `${href}${separator}search=${encodeURIComponent(search)}`
        : href;

    return (
        <Link
            href={target}
            preserveScroll
            className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[10px] font-medium transition ${
                active
                    ? 'border-[#FDBA74] bg-[#FFF7ED] text-[#C2410C]'
                    : 'border-transparent bg-[#F5F5F4] text-[#78716C] hover:border-[#E7E5E4] hover:bg-white'
            }`}
        >
            {label}
            <span className="text-[9px] opacity-70">{count}</span>
        </Link>
    );
};

export default SupplierProcurementList;

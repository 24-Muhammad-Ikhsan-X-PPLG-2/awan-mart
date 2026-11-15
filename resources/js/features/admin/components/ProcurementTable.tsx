import { Link } from '@inertiajs/react';
import { ArrowUpRight, ClipboardList } from 'lucide-react';
import { EmptyState } from './DashboardPrimitives';
import ProcurementStatusBadge from './ProcurementStatusBadge';
import type { ProcurementListItem } from '../types';
import { formatCurrency, formatDate, formatNumber } from '../formatters';

const ProcurementTable = ({
    procurements,
    hasFilters,
}: {
    procurements: ProcurementListItem[];
    hasFilters: boolean;
}) => (
    <>
        {procurements.length ? (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[790px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-[#EEF0F4] bg-[#FBFCFD] text-[10px] font-semibold tracking-[0.08em] text-[#8A95A5]">
                            <th scope="col" className="px-5 py-3.5 sm:px-6">
                                NOMOR PENGADAAN
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                SUPPLIER
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                TANGGAL
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                ITEM
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                TOTAL BIAYA
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                STATUS
                            </th>
                            <th scope="col" className="px-5 py-3.5 sm:px-6">
                                <span className="sr-only">Aksi</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F2F5]">
                        {procurements.map((procurement) => (
                            <tr
                                key={procurement.id}
                                className="text-xs text-[#526072] transition-colors hover:bg-[#FCFCFD]"
                            >
                                <th
                                    scope="row"
                                    className="px-5 py-4 font-semibold whitespace-nowrap text-[#203452] sm:px-6"
                                >
                                    {procurement.number}
                                </th>
                                <td className="max-w-44 truncate px-4 py-4 font-medium text-[#36465C]">
                                    {procurement.supplier}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-[#7C8798]">
                                    {formatDate(procurement.date)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap tabular-nums">
                                    {formatNumber(procurement.itemsCount)}
                                </td>
                                <td className="px-4 py-4 font-medium whitespace-nowrap text-[#203452]">
                                    {formatCurrency(procurement.totalCost)}
                                </td>
                                <td className="px-4 py-4">
                                    <ProcurementStatusBadge
                                        status={procurement.status}
                                    />
                                </td>
                                <td className="px-5 py-4 sm:px-6">
                                    <Link
                                        href={`/admin/procurements/${procurement.id}`}
                                        aria-label={`Lihat pengadaan ${procurement.number}`}
                                        className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-[#E2E6ED] px-2.5 text-[10px] font-semibold text-[#526B91] transition hover:border-[#526B91] hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                    >
                                        Detail
                                        <ArrowUpRight size={13} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <EmptyState
                icon={ClipboardList}
                title={
                    hasFilters
                        ? 'Pengadaan tidak ditemukan'
                        : 'Belum ada pengadaan'
                }
                description={
                    hasFilters
                        ? 'Coba ubah kata pencarian atau filter yang digunakan.'
                        : 'Buat pengadaan baru untuk memulai pencatatan pembelian stok.'
                }
            />
        )}
    </>
);

export default ProcurementTable;

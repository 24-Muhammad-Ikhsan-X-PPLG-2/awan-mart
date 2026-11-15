import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import ProcurementFilters from '@/features/admin/components/ProcurementFilters';
import ProcurementPagination from '@/features/admin/components/ProcurementPagination';
import ProcurementStats from '@/features/admin/components/ProcurementStats';
import ProcurementTable from '@/features/admin/components/ProcurementTable';
import type { ProcurementManagementProps } from '@/features/admin/types';

const AdminProcurementIndex = ({
    admin,
    generatedAt,
    filters,
    stats,
    procurements,
}: ProcurementManagementProps) => (
    <>
        <Head title="Procurement Management" />
        <AdminLayout
            admin={admin}
            generatedAt={generatedAt}
            title="Procurement Management"
            description="Manage inventory purchases and supplier procurement requests."
            activePage="procurements"
        >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] leading-5 text-[#8A95A5]">
                        Pantau permintaan pembelian stok dan progres supplier.
                    </p>
                </div>
                <Link
                    href="/admin/procurements/create"
                    className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91] sm:self-auto"
                >
                    <Plus size={15} />
                    Buat Pengadaan Baru
                </Link>
            </div>
            <ProcurementStats stats={stats} />
            <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                <div className="border-b border-[#EEF0F4] px-4 py-4 sm:px-5">
                    <h2 className="text-sm font-semibold text-[#203452]">
                        Daftar Pengadaan
                    </h2>
                    <p className="mt-1 text-[11px] text-[#8A95A5]">
                        Pengadaan tercatat: {procurements.total}
                    </p>
                </div>
                <ProcurementFilters filters={filters} />
                <ProcurementTable
                    procurements={procurements.data}
                    hasFilters={Boolean(
                        filters.search ||
                        filters.status ||
                        filters.dateFrom ||
                        filters.dateTo,
                    )}
                />
                <ProcurementPagination pagination={procurements} />
            </section>
        </AdminLayout>
    </>
);

export default AdminProcurementIndex;

import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus, Search, Truck, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminResourcePagination from '@/features/admin/components/AdminResourcePagination';
import { formatCurrency } from '@/features/admin/formatters';
import type { DashboardProps } from '@/features/admin/types';

type Courier = {
    id: number;
    name: string;
    supplierId: number;
    supplierName: string;
    supplierEmail: string;
    shippingCost: number;
    isActive: boolean;
    ordersCount: number;
};

type Props = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    couriers: {
        data: Courier[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        from: number | null;
        to: number | null;
        total: number;
        last_page: number;
    };
    filters: { search: string; status: '' | 'active' | 'inactive' };
};

const AdminCouriersPage = ({
    admin,
    generatedAt,
    couriers,
    filters,
}: Props) => {
    const [search, setSearch] = useState(filters.search);
    const visit = (nextSearch = search.trim(), status = filters.status) =>
        router.get(
            '/admin/couriers',
            { search: nextSearch || undefined, status: status || undefined },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        visit();
    };
    const remove = (courier: Courier) => {
        if (window.confirm(`Hapus konfigurasi kurir "${courier.name}"?`)) {
            router.delete(`/admin/couriers/${courier.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Kelola Kurir" />
            <AdminLayout
                admin={admin}
                generatedAt={generatedAt}
                title="Kelola Kurir"
                description="Tetapkan supplier sebagai kurir dan kelola tarif pengiriman."
                activePage="couriers"
            >
                <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#E5E8EE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="text-sm font-semibold text-[#203452]">
                                Daftar kurir
                            </h2>
                            <p className="mt-1 text-[11px] text-[#8A95A5]">
                                {couriers.total} layanan terdaftar
                            </p>
                        </div>
                        <Link
                            href="/admin/couriers/create"
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white hover:bg-[#314D73]"
                        >
                            <Plus size={15} /> Tambah kurir
                        </Link>
                    </div>
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-2 border-b border-[#E5E8EE] p-4 sm:flex-row"
                    >
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Cari kurir</span>
                            <Search
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]"
                            />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari nama layanan, supplier, atau email..."
                                className="h-10 w-full rounded-lg border border-[#E2E6EE] pr-3 pl-9 text-xs outline-none focus:border-[#526B91]"
                            />
                        </label>
                        <select
                            value={filters.status}
                            onChange={(event) =>
                                visit(
                                    search.trim(),
                                    event.target
                                        .value as Props['filters']['status'],
                                )
                            }
                            className="h-10 rounded-lg border border-[#E2E6EE] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91]"
                        >
                            <option value="">Semua status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]">
                            <Search size={14} /> Cari
                        </button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#F8F9FC] text-[10px] font-semibold tracking-wide text-[#8A95A5] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Layanan</th>
                                    <th className="px-4 py-3">
                                        Supplier / kurir
                                    </th>
                                    <th className="px-4 py-3">Ongkos kirim</th>
                                    <th className="px-4 py-3">Pesanan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EEF0F4]">
                                {couriers.data.map((courier) => (
                                    <tr key={courier.id} className="text-xs">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-10 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#203452]">
                                                    <Truck size={17} />
                                                </span>
                                                <span className="font-semibold text-[#344054]">
                                                    {courier.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-[#344054]">
                                                {courier.supplierName}
                                            </p>
                                            <p className="mt-1 text-[10px] text-[#98A2B3]">
                                                {courier.supplierEmail}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[#344054]">
                                            {formatCurrency(
                                                courier.shippingCost,
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-[#667085]">
                                            {courier.ordersCount}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${courier.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F2F4F7] text-[#667085]'}`}
                                            >
                                                {courier.isActive
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/admin/couriers/${courier.id}/edit`}
                                                    aria-label={`Edit ${courier.name}`}
                                                    className="flex size-8 items-center justify-center rounded-lg text-[#526B91] hover:bg-[#EEF2F8]"
                                                >
                                                    <Edit3 size={15} />
                                                </Link>
                                                {!courier.ordersCount && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            remove(courier)
                                                        }
                                                        aria-label={`Hapus ${courier.name}`}
                                                        className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!couriers.data.length && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center text-xs text-[#8A95A5]"
                                        >
                                            Kurir tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <AdminResourcePagination pagination={couriers} />
                </section>
            </AdminLayout>
        </>
    );
};

export default AdminCouriersPage;

import { Head, router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import OrderListTable from '@/features/admin/components/OrderListTable';
import OrderManagementStats from '@/features/admin/components/OrderManagementStats';
import OrderPagination from '@/features/admin/components/OrderPagination';
import OrderStatusFilters from '@/features/admin/components/OrderStatusFilters';
import type { OrderManagementProps } from '@/features/admin/types';

const AdminOrdersPage = ({
    admin,
    generatedAt,
    filters,
    statusCounts,
    stats,
    orders,
}: OrderManagementProps) => {
    const [search, setSearch] = useState(filters.search);
    const [loading, setLoading] = useState(false);

    const visitOrders = (
        nextStatus = filters.status,
        nextSearch = search.trim(),
    ) => {
        setLoading(true);
        router.get(
            '/admin/orders',
            {
                search: nextSearch || undefined,
                status: nextStatus ?? undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visitOrders();
    };

    const hasFilters = Boolean(filters.search || filters.status);

    return (
        <>
            <Head title="Order Management" />
            <AdminLayout
                admin={admin}
                generatedAt={generatedAt}
                title="Order Management"
                description="Manage and monitor customer orders."
                activePage="orders"
            >
                <OrderManagementStats stats={stats} />

                <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                    <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="text-sm font-semibold text-[#203452]">
                                Daftar pesanan
                            </h2>
                            <p className="mt-1 text-[11px] text-[#8A95A5]">
                                Cari, filter, dan tinjau pesanan pelanggan.
                            </p>
                        </div>
                        <form
                            onSubmit={submitSearch}
                            role="search"
                            className="flex w-full gap-2 sm:max-w-sm"
                        >
                            <label className="relative min-w-0 flex-1">
                                <span className="sr-only">
                                    Cari nomor pesanan atau nama pelanggan
                                </span>
                                <Search
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Nomor pesanan atau pelanggan..."
                                    className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white pr-9 pl-9 text-xs text-[#344054] transition outline-none placeholder:text-[#A0A9B6] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        aria-label="Hapus pencarian"
                                        onClick={() => {
                                            setSearch('');
                                            visitOrders(filters.status, '');
                                        }}
                                        className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-[#98A2B3] hover:bg-[#F3F5F8] hover:text-[#526B91]"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </label>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-wait disabled:opacity-70"
                            >
                                <Search size={14} />
                                Cari
                            </button>
                        </form>
                    </div>

                    <OrderStatusFilters
                        statuses={statusCounts}
                        selectedStatus={filters.status}
                        search={search.trim()}
                        onLoading={setLoading}
                    />

                    <OrderListTable
                        orders={orders.data}
                        statuses={statusCounts}
                        loading={loading}
                        hasFilters={hasFilters}
                    />
                    <OrderPagination pagination={orders} />
                </section>
            </AdminLayout>
        </>
    );
};

export default AdminOrdersPage;

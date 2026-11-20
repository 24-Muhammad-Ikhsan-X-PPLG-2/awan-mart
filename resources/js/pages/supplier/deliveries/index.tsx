import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MapPin,
    PackageCheck,
    Search,
    Truck,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import SupplierLayout from '@/features/supplier/components/SupplierLayout';
import type { SupplierProfile } from '@/features/supplier/types';

type Delivery = {
    id: number;
    orderNumber: string;
    customer: string;
    phone: string | null;
    address: string;
    itemsCount: number;
    status: 'shipped' | 'completed';
    shippedAt: string | null;
    completedAt: string | null;
};

type Props = {
    supplier: SupplierProfile;
    generatedAt: string;
    filters: { search: string; status: '' | 'shipped' | 'completed' };
    stats: { shipped: number; completed: number };
    deliveries: {
        data: Delivery[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    success: string | null;
};

const dateFormat = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

const formatDate = (date: string | null) =>
    date ? dateFormat.format(new Date(date)) : 'Belum tersedia';

const SupplierDeliveriesPage = ({
    supplier,
    generatedAt,
    filters,
    stats,
    deliveries,
    success,
}: Props) => {
    const [search, setSearch] = useState(filters.search);
    const visit = (
        nextSearch = search.trim(),
        status: Props['filters']['status'] = filters.status,
    ) =>
        router.get(
            '/supplier/deliveries',
            { search: nextSearch || undefined, status: status || undefined },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        visit();
    };
    const complete = (delivery: Delivery) => {
        if (
            window.confirm(
                `Tandai pesanan ${delivery.orderNumber} telah selesai diterima?`,
            )
        ) {
            router.patch(
                `/supplier/deliveries/${delivery.id}/complete`,
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Pengiriman Pesanan" />
            <SupplierLayout
                supplier={supplier}
                title="Pengiriman Pesanan"
                description="Pantau pengiriman yang ditugaskan kepada Anda dan konfirmasi pesanan setelah diterima pelanggan."
            >
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <p className="text-xs text-[#78716C]">
                        Diperbarui {formatDate(generatedAt)}
                    </p>
                    <div className="flex gap-2 text-xs">
                        <span className="rounded-full bg-violet-50 px-3 py-1.5 font-medium text-violet-700">
                            Dalam pengiriman: {stats.shipped}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                            Selesai: {stats.completed}
                        </span>
                    </div>
                </div>
                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800"
                    >
                        {success}
                    </div>
                )}
                <section className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-[0_2px_8px_rgba(41,37,36,0.03)]">
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-2 border-b border-[#F0EFED] p-4 sm:flex-row"
                    >
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">
                                Cari pesanan atau pelanggan
                            </span>
                            <Search
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#A8A29E]"
                            />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari nomor pesanan atau nama pelanggan..."
                                className="h-10 w-full rounded-lg border border-[#E7E5E4] pr-3 pl-9 text-xs outline-none focus:border-[#F97316]"
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
                            className="h-10 rounded-lg border border-[#E7E5E4] bg-white px-3 text-xs text-[#44403C] outline-none focus:border-[#F97316]"
                        >
                            <option value="">Semua status</option>
                            <option value="shipped">Dalam pengiriman</option>
                            <option value="completed">Selesai</option>
                        </select>
                        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E7E5E4] px-4 text-xs font-semibold text-[#57534E] hover:bg-[#FAFAF9]">
                            <Search size={14} /> Cari
                        </button>
                    </form>

                    <div className="divide-y divide-[#F0EFED]">
                        {deliveries.data.map((delivery) => (
                            <article key={delivery.id} className="p-4 sm:p-5">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-sm font-semibold text-[#292524]">
                                                {delivery.orderNumber}
                                            </h2>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${delivery.status === 'shipped' ? 'bg-violet-50 text-violet-700' : 'bg-emerald-50 text-emerald-700'}`}
                                            >
                                                {delivery.status === 'shipped'
                                                    ? 'Dalam pengiriman'
                                                    : 'Selesai'}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs font-medium text-[#44403C]">
                                            {delivery.customer}
                                        </p>
                                        {delivery.phone && (
                                            <p className="mt-1 text-xs text-[#78716C]">
                                                {delivery.phone}
                                            </p>
                                        )}
                                        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#78716C]">
                                            <MapPin
                                                size={14}
                                                className="mt-0.5 shrink-0"
                                            />
                                            <span>{delivery.address}</span>
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#A8A29E]">
                                            <span>
                                                {delivery.itemsCount} item
                                            </span>
                                            <span>
                                                Dikirim:{' '}
                                                {formatDate(delivery.shippedAt)}
                                            </span>
                                            {delivery.completedAt && (
                                                <span>
                                                    Selesai:{' '}
                                                    {formatDate(
                                                        delivery.completedAt,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {delivery.status === 'shipped' && (
                                        <button
                                            type="button"
                                            onClick={() => complete(delivery)}
                                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73]"
                                        >
                                            <CheckCircle2 size={15} />
                                            Tandai selesai
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                        {!deliveries.data.length && (
                            <div className="px-5 py-16 text-center">
                                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F5F5F4] text-[#A8A29E]">
                                    {filters.status === 'completed' ? (
                                        <PackageCheck size={20} />
                                    ) : (
                                        <Truck size={20} />
                                    )}
                                </span>
                                <p className="mt-3 text-sm font-semibold text-[#44403C]">
                                    Tidak ada pengiriman ditemukan
                                </p>
                                <p className="mt-1 text-xs text-[#A8A29E]">
                                    Pesanan yang ditugaskan kepada Anda akan
                                    muncul di sini.
                                </p>
                            </div>
                        )}
                    </div>
                    {deliveries.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F0EFED] px-4 py-4 sm:flex-row">
                            <p className="text-xs text-[#78716C]">
                                Menampilkan {deliveries.from ?? 0}–
                                {deliveries.to ?? 0} dari {deliveries.total}
                            </p>
                            <nav
                                aria-label="Navigasi pengiriman"
                                className="flex items-center gap-2"
                            >
                                {deliveries.prev_page_url ? (
                                    <Link
                                        href={deliveries.prev_page_url}
                                        preserveScroll
                                        className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E4] text-[#57534E]"
                                    >
                                        <ChevronLeft size={16} />
                                    </Link>
                                ) : (
                                    <span className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E4] text-[#D6D3D1]">
                                        <ChevronLeft size={16} />
                                    </span>
                                )}
                                <span className="px-2 text-xs text-[#78716C]">
                                    {deliveries.current_page} /{' '}
                                    {deliveries.last_page}
                                </span>
                                {deliveries.next_page_url ? (
                                    <Link
                                        href={deliveries.next_page_url}
                                        preserveScroll
                                        className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E4] text-[#57534E]"
                                    >
                                        <ChevronRight size={16} />
                                    </Link>
                                ) : (
                                    <span className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E4] text-[#D6D3D1]">
                                        <ChevronRight size={16} />
                                    </span>
                                )}
                            </nav>
                        </div>
                    )}
                </section>
            </SupplierLayout>
        </>
    );
};

export default SupplierDeliveriesPage;

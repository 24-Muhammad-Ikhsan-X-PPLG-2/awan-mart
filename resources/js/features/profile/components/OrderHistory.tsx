import { formatPrice } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import RatingStars from '@/features/ProductDetail/reviews/RatingStars';
import {
    ArrowRight,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Package,
    Search,
    ShoppingBag,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { OrderData, PaginatedOrders } from '../types';
import SectionHeading from './SectionHeading';

type Props = {
    orders: PaginatedOrders;
    filters: {
        status: string;
        search: string;
    };
};

const orderStatuses = [
    { value: '', label: 'Semua Pesanan' },
    { value: 'pending_payment', label: 'Menunggu Pembayaran' },
    { value: 'processing', label: 'Diproses' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'canceled', label: 'Dibatalkan' },
];

const orderStatusStyles: Record<OrderData['status'], string> = {
    pending_payment: 'border-amber-200 bg-amber-50 text-amber-800',
    processing: 'border-blue-200 bg-blue-50 text-blue-800',
    shipped: 'border-violet-200 bg-violet-50 text-violet-800',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    canceled: 'border-red-200 bg-red-50 text-red-700',
};

const paymentStatusStyles: Record<
    NonNullable<OrderData['payment']>['status'],
    string
> = {
    pending: 'text-amber-700',
    success: 'text-emerald-700',
    failed: 'text-red-700',
    expired: 'text-[#667085]',
    canceled: 'text-[#667085]',
};

const orderStatusLabels: Record<OrderData['status'], string> = {
    pending_payment: 'Menunggu Pembayaran',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    canceled: 'Dibatalkan',
};

const paymentStatusLabels: Record<
    NonNullable<OrderData['payment']>['status'],
    string
> = {
    pending: 'Menunggu Pembayaran',
    success: 'Berhasil',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    canceled: 'Dibatalkan',
};

const OrderHistory = ({ orders, filters }: Props) => {
    const [search, setSearch] = useState(filters.search);
    const [selectedStatus, setSelectedStatus] = useState(filters.status);

    useEffect(() => {
        setSearch(filters.search);
        setSelectedStatus(filters.status);
    }, [filters.search, filters.status]);

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            '/profile',
            {
                search: search || undefined,
                status: selectedStatus || undefined,
            },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const applyStatus = (status: string) => {
        setSelectedStatus(status);
        router.get(
            '/profile',
            {
                search: search || undefined,
                status: status || undefined,
            },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <section id="orders" className="scroll-mt-24">
            <div className="rounded-xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <SectionHeading
                        eyebrow="YOUR PURCHASES"
                        title="Riwayat Pesanan"
                        description="Lihat produk yang dibeli dan status setiap pesanan."
                    />
                    <span className="text-xs font-medium text-[#98A2B3]">
                        {orders.total} pesanan
                    </span>
                </div>

                <form onSubmit={applyFilters} className="mt-5 space-y-3">
                    <label className="relative block max-w-md">
                        <span className="sr-only">
                            Cari nomor pesanan atau produk
                        </span>
                        <Search
                            size={17}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nomor pesanan atau produk"
                            className="h-11 w-full rounded-lg border border-[#E2E6ED] bg-white pr-3 pl-10 text-sm transition outline-none placeholder:text-[#98A2B3] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                        />
                    </label>

                    <div
                        className="flex gap-2 overflow-x-auto pb-1"
                        aria-label="Filter status pesanan"
                    >
                        {orderStatuses.map((status) => (
                            <button
                                key={status.value || 'all'}
                                type="button"
                                onClick={() => applyStatus(status.value)}
                                aria-pressed={selectedStatus === status.value}
                                className={`min-h-9 shrink-0 rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91] ${
                                    selectedStatus === status.value
                                        ? 'border-[#203452] bg-[#203452] text-white'
                                        : 'border-[#E2E6ED] bg-white text-[#667085] hover:border-[#9AAAC0] hover:text-[#203452]'
                                }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                    <button type="submit" className="sr-only">
                        Cari pesanan
                    </button>
                </form>

                <div className="mt-5 space-y-4">
                    {orders.data.length > 0 ? (
                        orders.data.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <EmptyOrders
                            hasFilters={
                                Boolean(filters.search) ||
                                Boolean(filters.status)
                            }
                        />
                    )}
                </div>

                {orders.last_page > 1 && (
                    <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#E2E6ED] pt-4 sm:flex-row">
                        <p className="text-xs text-[#667085]">
                            Menampilkan {orders.from ?? 0}–{orders.to ?? 0} dari{' '}
                            {orders.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <PageLink
                                href={orders.prev_page_url}
                                label="Halaman sebelumnya"
                                disabled={!orders.prev_page_url}
                                icon="previous"
                            />
                            <span className="px-2 text-xs font-medium text-[#526B91]">
                                {orders.current_page} / {orders.last_page}
                            </span>
                            <PageLink
                                href={orders.next_page_url}
                                label="Halaman berikutnya"
                                disabled={!orders.next_page_url}
                                icon="next"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const OrderCard = ({ order }: { order: OrderData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const itemCount = order.order_items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    return (
        <article className="overflow-hidden rounded-xl border border-[#E2E6ED] bg-white">
            <div className="flex flex-col gap-3 bg-[#F8F9FC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-[#98A2B3] uppercase">
                            Nomor Pesanan
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#203452]">
                            {order.order_number}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-[#98A2B3] uppercase">
                            Tanggal
                        </p>
                        <p className="mt-0.5 text-sm text-[#526B91]">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-semibold ${orderStatusStyles[order.status]}`}
                    >
                        {orderStatusLabels[order.status]}
                    </span>
                    {order.payment && (
                        <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${paymentStatusStyles[order.payment.status]}`}
                        >
                            <CreditCard size={13} />
                            {paymentStatusLabels[order.payment.status]}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-3 p-4 sm:px-5">
                {order.order_items.slice(0, 2).map((item) => (
                    <OrderItemRow item={item} key={item.id} />
                ))}
                {order.order_items.length > 2 && !isExpanded && (
                    <p className="pl-1 text-xs text-[#667085]">
                        +{order.order_items.length - 2} produk lainnya
                    </p>
                )}
                {isExpanded &&
                    order.order_items
                        .slice(2)
                        .map((item) => (
                            <OrderItemRow item={item} key={item.id} />
                        ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E2E6ED] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#667085]">
                    <span>{itemCount} item</span>
                    {order.payment?.method && (
                        <span>
                            Metode: {formatPaymentMethod(order.payment.method)}
                        </span>
                    )}
                    {order.payment?.transaction_id && (
                        <span className="max-w-48 truncate">
                            Ref: {order.payment.transaction_id}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                        <p className="text-[10px] font-medium tracking-wide text-[#98A2B3] uppercase">
                            Total Pesanan
                        </p>
                        <p className="mt-0.5 text-base font-bold text-[#203452]">
                            {formatPrice(Number(order.total_price))}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {order.status === 'pending_payment' &&
                            order.payment?.status === 'pending' && (
                                <Link
                                    href={`/checkout/payment/${encodeURIComponent(order.order_number)}`}
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#203452] px-3 text-xs font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                >
                                    <CreditCard size={14} />
                                    Lanjutkan Pembayaran
                                </Link>
                            )}
                        <button
                            type="button"
                            onClick={() => setIsExpanded((current) => !current)}
                            aria-expanded={isExpanded}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#E2E6ED] px-3 text-xs font-semibold text-[#526B91] transition hover:border-[#526B91] hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                        >
                            {isExpanded ? 'Tutup Detail' : 'Lihat Detail'}
                            {isExpanded ? (
                                <X size={14} />
                            ) : (
                                <ArrowUpRight size={14} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="space-y-4 border-t border-[#E2E6ED] bg-[#FCFCFD] px-4 py-5 sm:px-5">
                    {order.status === 'completed' && (
                        <section className="space-y-4">
                            <h3 className="text-xs font-semibold tracking-wide text-[#526B91] uppercase">
                                Ulasan Produk
                            </h3>
                            {order.order_items.map((item) => {
                                const review = order.reviews.find(
                                    (entry) => entry.product_id === item.product_id,
                                );

                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border border-[#E2E6ED] bg-white p-4"
                                    >
                                        <p className="mb-3 text-sm font-semibold text-[#203452]">
                                            {item.product?.name ?? 'Produk'}
                                        </p>
                                        {review ? (
                                            <p className="text-sm font-medium text-emerald-700">
                                                Ulasan sudah dikirim.
                                            </p>
                                        ) : (
                                            <OrderReviewForm
                                                orderId={order.id}
                                                productId={item.product_id}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    )}
                    <div>
                        <h3 className="text-xs font-semibold tracking-wide text-[#526B91] uppercase">
                            Alamat Pengiriman
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-[#667085]">
                            {order.shipping_address}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold tracking-wide text-[#526B91] uppercase">
                            Rincian Pembayaran
                        </h3>
                        {order.payment ? (
                            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                                <Detail
                                    label="Provider"
                                    value={order.payment.provider}
                                />
                                <Detail
                                    label="Status pembayaran"
                                    value={
                                        paymentStatusLabels[
                                            order.payment.status
                                        ]
                                    }
                                />
                                {order.payment.method && (
                                    <Detail
                                        label="Metode"
                                        value={formatPaymentMethod(
                                            order.payment.method,
                                        )}
                                    />
                                )}
                                {order.payment.transaction_id && (
                                    <Detail
                                        label="ID Transaksi"
                                        value={order.payment.transaction_id}
                                    />
                                )}
                                <Detail
                                    label="Nominal"
                                    value={formatPrice(
                                        Number(order.payment.amount),
                                    )}
                                />
                            </dl>
                        ) : (
                            <p className="mt-1.5 text-sm text-[#667085]">
                                Informasi pembayaran belum tersedia.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

const OrderReviewForm = ({
    orderId,
    productId,
}: {
    orderId: number;
    productId: number;
}) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submitReview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!rating) {
            setErrors((current) => ({
                ...current,
                rating: 'Pilih rating terlebih dahulu.',
            }));
            return;
        }

        router.post(
            '/reviews',
            {
                order_id: orderId,
                product_id: productId,
                rating,
                title,
                content,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRating(0);
                    setTitle('');
                    setContent('');
                    setErrors({});
                },
                onError: (validationErrors) => setErrors(validationErrors),
            },
        );
    };

    return (
        <form onSubmit={submitReview} className="space-y-3">
            <div>
                <p className="mb-1.5 text-xs font-semibold text-[#526B91]">
                    Rating
                </p>
                <RatingStars
                    value={rating}
                    interactive
                    size={22}
                    onChange={(value) => {
                        setRating(value);
                        setErrors((current) => ({ ...current, rating: '' }));
                    }}
                />
                {errors.rating && (
                    <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
                )}
            </div>
            <label className="block">
                <span className="text-xs font-semibold text-[#526B91]">
                    Judul ulasan
                </span>
                <input
                    value={title}
                    maxLength={150}
                    onChange={(event) => {
                        setTitle(event.target.value);
                        setErrors((current) => ({ ...current, title: '' }));
                    }}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D0D5DD] px-3 text-sm outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                    placeholder="Bagaimana pengalamanmu?"
                />
                {errors.title && (
                    <span className="mt-1 block text-xs text-red-600">
                        {errors.title}
                    </span>
                )}
            </label>
            <label className="block">
                <span className="text-xs font-semibold text-[#526B91]">
                    Ceritakan pengalamanmu
                </span>
                <textarea
                    value={content}
                    maxLength={2000}
                    onChange={(event) => {
                        setContent(event.target.value);
                        setErrors((current) => ({ ...current, content: '' }));
                    }}
                    rows={4}
                    className="mt-1.5 w-full resize-y rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm leading-6 outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                    placeholder="Bagikan kualitas dan pengalaman penggunaan produk."
                />
                <span className="mt-1 block text-right text-xs text-[#667085]">
                    {content.length}/2000
                </span>
                {errors.content && (
                    <span className="mt-1 block text-xs text-red-600">
                        {errors.content}
                    </span>
                )}
            </label>
            <button
                type="submit"
                className="inline-flex min-h-10 items-center rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Kirim Ulasan
            </button>
        </form>
    );
};

const OrderItemRow = ({ item }: { item: OrderData['order_items'][number] }) => (
    <div className="flex items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E2E6ED] bg-[#F8F9FC]">
            {item.product?.product_images?.[0]?.image ? (
                <img
                    src={item.product.product_images[0].image}
                    alt=""
                    className="h-full w-full object-contain p-1"
                />
            ) : (
                <Package size={20} className="text-[#98A2B3]" />
            )}
        </div>
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#203452]">
                {item.product?.name ?? 'Produk tidak lagi tersedia'}
            </p>
            <p className="mt-1 text-xs text-[#667085]">
                {formatPrice(Number(item.price))} × {item.quantity}
            </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-[#203452]">
            {formatPrice(Number(item.price) * item.quantity)}
        </p>
    </div>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-0.5">
        <dt className="text-xs text-[#98A2B3]">{label}</dt>
        <dd className="text-sm font-medium break-all text-[#203452]">
            {value}
        </dd>
    </div>
);

const EmptyOrders = ({ hasFilters }: { hasFilters: boolean }) => (
    <div className="rounded-xl border border-dashed border-[#D8DEE8] bg-[#FCFCFD] px-5 py-12 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F0F3F8] text-[#526B91]">
            <ShoppingBag size={22} />
        </span>
        <h3 className="font-playfair mt-4 text-xl font-semibold text-[#203452]">
            {hasFilters
                ? 'Pesanan tidak ditemukan'
                : 'Your shopping journey starts here.'}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
            {hasFilters
                ? 'Coba ubah kata kunci atau filter status pesanan.'
                : 'Explore our collection and find the technology that fits your needs.'}
        </p>
        <Link
            href="/products"
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-sm font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
        >
            Explore Products
            <ArrowRight size={16} />
        </Link>
    </div>
);

const PageLink = ({
    href,
    label,
    disabled,
    icon,
}: {
    href: string | null;
    label: string;
    disabled: boolean;
    icon: 'previous' | 'next';
}) =>
    href && !disabled ? (
        <Link
            href={href}
            preserveScroll
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-lg border border-[#E2E6ED] text-[#526B91] transition hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
        >
            {icon === 'previous' ? (
                <ChevronLeft size={17} />
            ) : (
                <ChevronRight size={17} />
            )}
        </Link>
    ) : (
        <span
            aria-disabled="true"
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-lg border border-[#E2E6ED] text-[#C2C9D3]"
        >
            {icon === 'previous' ? (
                <ChevronLeft size={17} />
            ) : (
                <ChevronRight size={17} />
            )}
        </span>
    );

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));

const formatPaymentMethod = (method: string) =>
    method
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default OrderHistory;

import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    MapPin,
    Package,
    PackageCheck,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import {
    EmptyState,
    OrderStatusBadge,
    SectionHeading,
} from './DashboardPrimitives';
import OrderProgress from './OrderProgress';
import ShipOrderDialog from './ShipOrderDialog';
import type {
    OrderDetailProps,
    OrderPaymentState,
    OrderStatusValue,
} from '../types';
import { formatCurrency, formatDate } from '../formatters';

const orderStatusLabels: Record<OrderStatusValue, string> = {
    pending_payment: 'Menunggu pembayaran',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    canceled: 'Dibatalkan',
};

const paymentStatusClasses: Record<Exclude<OrderPaymentState, null>, string> = {
    pending: 'bg-[#F8F3E8] text-[#92733B]',
    success: 'bg-[#EDF4EF] text-[#557963]',
    failed: 'bg-[#F3EFF0] text-[#816A70]',
    expired: 'bg-[#F3EFF0] text-[#816A70]',
    canceled: 'bg-[#F3EFF0] text-[#816A70]',
};

const OrderDetailsPanel = ({
    order,
    successMessage,
    onShipped,
}: {
    order: OrderDetailProps['order'];
    successMessage: string | null;
    onShipped: () => void;
}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/orders"
                    className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-lg text-xs font-semibold text-[#526B91] transition hover:text-[#203452] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                >
                    <ArrowLeft size={15} />
                    Kembali ke pesanan
                </Link>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8A95A5]">
                            DETAIL PESANAN
                        </p>
                        <h2 className="font-playfair mt-1 text-2xl font-semibold text-[#203452] sm:text-3xl">
                            {order.orderNumber}
                        </h2>
                        <p className="mt-1 text-xs text-[#8A95A5]">
                            Dibuat{' '}
                            {formatDate(order.date, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <OrderStatusBadge
                            status={order.status}
                            label={orderStatusLabels[order.status]}
                        />
                        {order.canMarkAsShipped && (
                            <button
                                type="button"
                                onClick={() => setConfirmOpen(true)}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                            >
                                <PackageCheck size={15} />
                                Tandai sebagai Dikirim
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {successMessage && (
                <div
                    role="status"
                    className="mb-5 flex items-center gap-2 rounded-lg border border-[#D8E8DD] bg-[#EDF4EF] px-4 py-3 text-xs font-medium text-[#557963]"
                >
                    <CheckCircle2 size={16} />
                    {successMessage}
                </div>
            )}

            <section className="mb-6 rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
                <SectionHeading
                    eyebrow="STATUS PEMENUHAN"
                    title="Progres pesanan"
                    description="Status pengiriman terpisah dari status pembayaran."
                />
                <div className="mt-5">
                    <OrderProgress status={order.status} />
                </div>
            </section>

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                        <div className="px-5 py-5 sm:px-6">
                            <SectionHeading
                                eyebrow="RINCIAN"
                                title="Produk pesanan"
                                description={`${order.items.length} jenis produk dalam pesanan ini.`}
                            />
                        </div>
                        {order.items.length ? (
                            <div className="divide-y divide-[#F0F2F5] border-t border-[#EEF0F4] px-5 sm:px-6">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 py-4 sm:gap-4"
                                    >
                                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8EBF0] bg-[#F8F9FC]">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="size-full object-contain p-1"
                                                />
                                            ) : (
                                                <Package
                                                    size={20}
                                                    className="text-[#98A2B3]"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-semibold text-[#344054]">
                                                {item.productName}
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#8A95A5]">
                                                {formatCurrency(item.unitPrice)}{' '}
                                                × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="shrink-0 text-xs font-semibold text-[#203452]">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Package}
                                title="Tidak ada detail produk"
                                description="Item pesanan tidak tersedia."
                                compact
                            />
                        )}
                    </section>

                    <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F3F5F8] text-[#526B91]">
                                <UserRound size={16} />
                            </span>
                            <SectionHeading
                                eyebrow="PELANGGAN"
                                title="Informasi pelanggan"
                                description="Kontak dan alamat tujuan pesanan."
                            />
                        </div>
                        <dl className="grid gap-4 border-t border-[#EEF0F4] pt-4 sm:grid-cols-2">
                            <Detail label="Nama" value={order.customer.name} />
                            <Detail
                                label="Email"
                                value={order.customer.email}
                            />
                            <Detail
                                label="Nomor telepon"
                                value={order.customer.phone || 'Tidak tersedia'}
                            />
                            <div className="sm:col-span-2">
                                <dt className="flex items-center gap-1.5 text-[10px] text-[#98A2B3]">
                                    <MapPin size={12} />
                                    Alamat pengiriman
                                </dt>
                                <dd className="mt-1 text-xs leading-5 whitespace-pre-line text-[#344054]">
                                    {order.shippingAddress}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F3F5F8] text-[#526B91]">
                                <CreditCard size={16} />
                            </span>
                            <SectionHeading
                                eyebrow="PEMBAYARAN"
                                title="Ringkasan pembayaran"
                                description="Rincian pembayaran pesanan."
                            />
                        </div>
                        <div className="space-y-3 border-t border-[#EEF0F4] pt-4">
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="text-[#7C8798]">Status</span>
                                {order.payment.status ? (
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${paymentStatusClasses[order.payment.status]}`}
                                    >
                                        {order.payment.statusLabel}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-[#8A95A5]">
                                        {order.payment.statusLabel}
                                    </span>
                                )}
                            </div>
                            <Detail
                                label="Metode pembayaran"
                                value={formatPaymentMethod(
                                    order.payment.method,
                                )}
                            />
                            {order.payment.transactionId && (
                                <Detail
                                    label="ID transaksi"
                                    value={order.payment.transactionId}
                                />
                            )}
                            {order.payment.amount !== null && (
                                <Detail
                                    label="Nominal pembayaran"
                                    value={formatCurrency(order.payment.amount)}
                                />
                            )}
                        </div>
                        <div className="mt-5 space-y-3 border-t border-[#EEF0F4] pt-4 text-xs">
                            <SummaryLine
                                label="Subtotal produk"
                                value={order.summary.subtotal}
                            />
                            <SummaryLine
                                label="Ongkos kirim"
                                value={order.summary.shipping}
                            />
                            <div className="flex items-center justify-between gap-3 border-t border-[#EEF0F4] pt-3">
                                <span className="font-semibold text-[#203452]">
                                    Total pembayaran
                                </span>
                                <span className="text-sm font-semibold text-[#203452]">
                                    {formatCurrency(order.summary.total)}
                                </span>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>

            <ShipOrderDialog
                orderId={order.id}
                orderNumber={order.orderNumber}
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onSuccess={() => {
                    setConfirmOpen(false);
                    onShipped();
                }}
            />
        </>
    );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div>
        <dt className="text-[10px] text-[#98A2B3]">{label}</dt>
        <dd className="mt-0.5 text-xs font-medium break-all text-[#344054]">
            {value}
        </dd>
    </div>
);

const SummaryLine = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-[#7C8798]">{label}</span>
        <span className="font-medium text-[#526072]">
            {formatCurrency(value)}
        </span>
    </div>
);

const formatPaymentMethod = (method: string | null) => {
    if (!method) {
        return 'Tidak tersedia';
    }

    return method
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase('id-ID'));
};

export default OrderDetailsPanel;

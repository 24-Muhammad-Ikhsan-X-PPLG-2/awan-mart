import { Link } from '@inertiajs/react';
import { Eye, Search, ShoppingBag } from 'lucide-react';
import { EmptyState, OrderStatusBadge } from './DashboardPrimitives';
import type {
    OrderListItem,
    OrderPaymentState,
    OrderStatusValue,
} from '../types';
import { formatCurrency, formatDate } from '../formatters';

const paymentStatusClasses: Record<Exclude<OrderPaymentState, null>, string> = {
    pending: 'bg-[#F8F3E8] text-[#92733B]',
    success: 'bg-[#EDF4EF] text-[#557963]',
    failed: 'bg-[#F3EFF0] text-[#816A70]',
    expired: 'bg-[#F3EFF0] text-[#816A70]',
    canceled: 'bg-[#F3EFF0] text-[#816A70]',
};

const paymentStatusLabels: Record<Exclude<OrderPaymentState, null>, string> = {
    pending: 'Menunggu',
    success: 'Berhasil',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    canceled: 'Dibatalkan',
};

type Props = {
    orders: OrderListItem[];
    statuses: Array<{
        value: OrderStatusValue;
        label: string;
        count: number;
    }>;
    loading: boolean;
    hasFilters: boolean;
};

const OrderListTable = ({ orders, statuses, loading, hasFilters }: Props) => (
    <div className="relative">
        {loading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-20 text-xs font-medium text-[#526B91]">
                Memuat pesanan...
            </div>
        )}
        {orders.length ? (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-[#EEF0F4] bg-[#FBFCFD] text-[10px] font-semibold tracking-[0.08em] text-[#8A95A5]">
                            <th scope="col" className="px-5 py-3.5 sm:px-6">
                                PESANAN
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                PELANGGAN
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                TANGGAL
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                TOTAL
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                PEMBAYARAN
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                STATUS PESANAN
                            </th>
                            <th scope="col" className="px-5 py-3.5 sm:px-6">
                                <span className="sr-only">Aksi</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F2F5]">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="text-xs text-[#526072] transition-colors hover:bg-[#FCFCFD]"
                            >
                                <th
                                    scope="row"
                                    className="px-5 py-4 font-semibold whitespace-nowrap text-[#203452] sm:px-6"
                                >
                                    {order.orderNumber}
                                </th>
                                <td className="max-w-44 truncate px-4 py-4">
                                    {order.customer}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-[#7C8798]">
                                    {formatDate(order.date)}
                                </td>
                                <td className="px-4 py-4 font-medium whitespace-nowrap text-[#203452]">
                                    {formatCurrency(order.total)}
                                </td>
                                <td className="px-4 py-4">
                                    {order.paymentStatus ? (
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${paymentStatusClasses[order.paymentStatus]}`}
                                        >
                                            {
                                                paymentStatusLabels[
                                                    order.paymentStatus
                                                ]
                                            }
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-[#98A2B3]">
                                            Belum tersedia
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <OrderStatusBadge
                                        status={order.status}
                                        label={
                                            statuses.find(
                                                (status) =>
                                                    status.value ===
                                                    order.status,
                                            )?.label ?? order.status
                                        }
                                    />
                                </td>
                                <td className="px-5 py-4 sm:px-6">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        aria-label={`Lihat pesanan ${order.orderNumber}`}
                                        className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-[#E2E6ED] px-2.5 text-[10px] font-semibold text-[#526B91] transition hover:border-[#526B91] hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                    >
                                        <Eye size={13} />
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <EmptyState
                icon={hasFilters ? Search : ShoppingBag}
                title={
                    hasFilters ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'
                }
                description={
                    hasFilters
                        ? 'Coba ubah kata pencarian atau filter status.'
                        : 'Pesanan pelanggan akan muncul di sini.'
                }
            />
        )}
    </div>
);

export default OrderListTable;

import { ArrowDownRight, ShoppingBag } from 'lucide-react';
import {
    EmptyState,
    OrderStatusBadge,
    SectionHeading,
} from './DashboardPrimitives';
import type { DashboardProps } from '../types';
import { formatCurrency, formatDate } from '../formatters';

const RecentOrders = ({
    orders,
    statuses,
}: {
    orders: DashboardProps['recentOrders'];
    statuses: DashboardProps['orderStatuses'];
}) => (
    <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <SectionHeading
                eyebrow="AKTIVITAS TERBARU"
                title="Pesanan terbaru"
                description="Pesanan yang baru masuk ke toko."
            />
            <span className="hidden items-center gap-1.5 text-xs font-medium text-[#98A2B3] sm:flex">
                <ArrowDownRight size={14} />7 terbaru
            </span>
        </div>
        {orders.length ? (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[690px] border-collapse text-left">
                    <thead>
                        <tr className="border-y border-[#EEF0F4] bg-[#FBFCFD] text-[10px] font-semibold tracking-[0.08em] text-[#8A95A5]">
                            <th className="px-6 py-3">PESANAN</th>
                            <th className="px-4 py-3">PELANGGAN</th>
                            <th className="px-4 py-3">TANGGAL</th>
                            <th className="px-4 py-3">TOTAL</th>
                            <th className="px-6 py-3">STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F2F5]">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="text-xs text-[#526072]"
                            >
                                <td className="px-6 py-4 font-semibold text-[#203452]">
                                    {order.orderNumber}
                                </td>
                                <td className="max-w-40 truncate px-4 py-4">
                                    {order.customer}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-[#7C8798]">
                                    {formatDate(order.date)}
                                </td>
                                <td className="px-4 py-4 font-medium whitespace-nowrap text-[#203452]">
                                    {formatCurrency(order.total)}
                                </td>
                                <td className="px-6 py-4">
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <EmptyState
                icon={ShoppingBag}
                title="Belum ada pesanan"
                description="Pesanan pelanggan akan muncul di sini."
            />
        )}
    </section>
);

export default RecentOrders;

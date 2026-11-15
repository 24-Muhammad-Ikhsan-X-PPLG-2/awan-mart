import { BarChart3, Package } from 'lucide-react';
import { EmptyState, SectionHeading } from './DashboardPrimitives';
import type { DashboardProps } from '../types';
import { formatCurrency, formatNumber } from '../formatters';

const TopProducts = ({
    products,
}: {
    products: DashboardProps['topProducts'];
}) => (
    <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
            <SectionHeading
                eyebrow="PENJUALAN"
                title="Produk terlaris"
                description="Berdasarkan item dari pesanan dengan pembayaran berhasil."
            />
            <BarChart3 size={18} className="shrink-0 text-[#526B91]" />
        </div>
        {products.length ? (
            <ol className="divide-y divide-[#F0F2F5]">
                {products.map((product, index) => (
                    <li
                        key={product.id}
                        className="flex items-center gap-3 py-3.5 first:pt-1"
                    >
                        <span className="w-5 text-xs font-semibold text-[#98A2B3] tabular-nums">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt=""
                                className="size-10 rounded-lg border border-[#EEF0F4] object-cover"
                            />
                        ) : (
                            <span className="flex size-10 items-center justify-center rounded-lg bg-[#F3F5F8] text-[#8090A5]">
                                <Package size={17} />
                            </span>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#36465C]">
                                {product.name}
                            </p>
                            <p className="mt-1 text-[10px] text-[#98A2B3]">
                                Terjual {formatNumber(product.quantity)} unit
                            </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-[#203452]">
                            {formatCurrency(product.revenue)}
                        </span>
                    </li>
                ))}
            </ol>
        ) : (
            <EmptyState
                icon={BarChart3}
                title="Belum ada data penjualan"
                description="Produk terlaris tampil setelah ada pembayaran berhasil."
                compact
            />
        )}
    </section>
);

export default TopProducts;

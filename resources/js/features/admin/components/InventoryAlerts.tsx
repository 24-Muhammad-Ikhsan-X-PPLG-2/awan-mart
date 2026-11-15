import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CountTile, EmptyState, SectionHeading } from './DashboardPrimitives';
import type { DashboardProps } from '../types';
import { formatNumber } from '../formatters';

const InventoryAlerts = ({
    inventory,
}: {
    inventory: DashboardProps['inventory'];
}) => (
    <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
            <SectionHeading
                eyebrow="KONTROL STOK"
                title="Perhatian inventaris"
                description={`Stok rendah: ${inventory.lowStockThreshold} unit atau kurang.`}
            />
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F8F3E8] text-[#92733B]">
                <AlertTriangle size={17} />
            </span>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2.5">
            <CountTile
                label="Stok menipis"
                value={inventory.lowStockCount}
                tone="warning"
            />
            <CountTile
                label="Stok habis"
                value={inventory.outOfStockCount}
                tone="danger"
            />
        </div>
        {inventory.products.length ? (
            <ul className="divide-y divide-[#F0F2F5]">
                {inventory.products.map((product) => (
                    <li
                        key={product.id}
                        className="flex items-center justify-between gap-3 py-3 first:pt-1"
                    >
                        <span className="min-w-0 truncate text-xs font-medium text-[#36465C]">
                            {product.name}
                        </span>
                        <span
                            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${
                                product.stock <= 0
                                    ? 'bg-[#F3EFF0] text-[#816A70]'
                                    : 'bg-[#F8F3E8] text-[#92733B]'
                            }`}
                        >
                            {product.stock <= 0
                                ? 'Habis'
                                : `${formatNumber(product.stock)} unit`}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <EmptyState
                icon={CheckCircle2}
                title="Stok terjaga"
                description="Tidak ada produk yang perlu diperhatikan."
                compact
            />
        )}
    </section>
);

export default InventoryAlerts;

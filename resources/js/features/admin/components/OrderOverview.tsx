import { ShoppingBag } from 'lucide-react';
import { SectionHeading } from './DashboardPrimitives';
import type { DashboardProps } from '../types';
import { formatNumber } from '../formatters';

const OrderOverview = ({
    statuses,
    totalOrders,
}: {
    statuses: DashboardProps['orderStatuses'];
    totalOrders: number;
}) => (
    <section className="rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
            <SectionHeading
                eyebrow="OPERASIONAL"
                title="Status pesanan"
                description="Distribusi seluruh pesanan saat ini."
            />
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F5F8] text-[#526B91]">
                <ShoppingBag size={17} />
            </span>
        </div>
        <div className="space-y-4">
            {statuses.map((status) => {
                const percent = totalOrders
                    ? Math.round((status.count / totalOrders) * 100)
                    : 0;

                return (
                    <div key={status.value}>
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                            <span className="text-[#526072]">
                                {status.label}
                            </span>
                            <span className="font-semibold text-[#203452] tabular-nums">
                                {formatNumber(status.count)}
                            </span>
                        </div>
                        <div
                            className="h-1.5 overflow-hidden rounded-full bg-[#F1F3F6]"
                            role="progressbar"
                            aria-label={`${status.label}: ${percent}%`}
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="h-full rounded-full bg-[#526B91] transition-[width]"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);

export default OrderOverview;

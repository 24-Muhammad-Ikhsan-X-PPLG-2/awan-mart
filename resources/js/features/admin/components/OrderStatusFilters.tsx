import { router } from '@inertiajs/react';
import type { OrderStatusValue } from '../types';

type Props = {
    statuses: Array<{
        value: OrderStatusValue;
        label: string;
        count: number;
    }>;
    selectedStatus: OrderStatusValue | null;
    search: string;
    onLoading: (loading: boolean) => void;
};

const OrderStatusFilters = ({
    statuses,
    selectedStatus,
    search,
    onLoading,
}: Props) => {
    const changeStatus = (status: OrderStatusValue | null) => {
        onLoading(true);
        router.get(
            '/admin/orders',
            {
                search: search || undefined,
                status: status ?? undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onFinish: () => onLoading(false),
            },
        );
    };

    return (
        <nav
            aria-label="Filter status pesanan"
            className="flex gap-1 overflow-x-auto border-b border-[#E9ECF1] px-4 sm:px-5"
        >
            <FilterButton
                label="Semua pesanan"
                active={selectedStatus === null}
                onClick={() => changeStatus(null)}
            />
            {statuses.map((status) => (
                <FilterButton
                    key={status.value}
                    label={status.label}
                    count={status.count}
                    active={selectedStatus === status.value}
                    onClick={() => changeStatus(status.value)}
                />
            ))}
        </nav>
    );
};

const FilterButton = ({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 border-b-2 px-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#526B91] sm:px-3 ${
            active
                ? 'border-[#203452] text-[#203452]'
                : 'border-transparent text-[#7C8798] hover:text-[#203452]'
        }`}
    >
        {label}
        {count !== undefined && (
            <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] tabular-nums ${
                    active
                        ? 'bg-[#EEF2F8] text-[#203452]'
                        : 'bg-[#F3F5F8] text-[#8994A3]'
                }`}
            >
                {count}
            </span>
        )}
    </button>
);

export default OrderStatusFilters;

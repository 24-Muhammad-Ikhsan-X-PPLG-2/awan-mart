import type { LucideIcon } from 'lucide-react';
import type { OrderStatusValue } from '../types';
import { formatNumber } from '../formatters';

const orderStatusClasses: Record<OrderStatusValue, string> = {
    pending_payment: 'bg-[#F8F3E8] text-[#92733B]',
    processing: 'bg-[#EEF2F8] text-[#526B91]',
    shipped: 'bg-[#EAF1F4] text-[#527283]',
    completed: 'bg-[#EDF4EF] text-[#557963]',
    canceled: 'bg-[#F3EFF0] text-[#816A70]',
};

export const SectionHeading = ({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) => (
    <div className="min-w-0">
        <p className="mb-1 text-[9px] font-semibold tracking-[0.15em] text-[#98A2B3]">
            {eyebrow}
        </p>
        <h2 className="text-[15px] leading-5 font-semibold tracking-tight text-[#203452]">
            {title}
        </h2>
        <p className="mt-1 text-[10px] leading-4 text-[#8A95A5]">
            {description}
        </p>
    </div>
);

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    compact = false,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    compact?: boolean;
}) => (
    <div
        className={`flex flex-col items-center justify-center px-5 text-center ${
            compact ? 'min-h-32 py-5' : 'min-h-48 py-9'
        }`}
    >
        <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-[#F3F5F8] text-[#8090A5]">
            <Icon size={17} />
        </span>
        <p className="text-xs font-semibold text-[#526072]">{title}</p>
        <p className="mt-1 max-w-xs text-[10px] leading-4 text-[#98A2B3]">
            {description}
        </p>
    </div>
);

export const OrderStatusBadge = ({
    status,
    label,
}: {
    status: OrderStatusValue;
    label: string;
}) => (
    <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${orderStatusClasses[status]}`}
    >
        {label}
    </span>
);

export const CountTile = ({
    label,
    value,
    tone = 'default',
}: {
    label: string;
    value: number;
    tone?: 'default' | 'warning' | 'danger';
}) => {
    const valueColor = {
        default: 'text-[#203452]',
        warning: 'text-[#92733B]',
        danger: 'text-[#816A70]',
    }[tone];

    return (
        <div className="rounded-lg bg-[#F8F9FC] px-3 py-2.5">
            <p className="text-[10px] text-[#8A95A5]">{label}</p>
            <p
                className={`mt-1 text-lg leading-none font-semibold ${valueColor}`}
            >
                {formatNumber(value)}
            </p>
        </div>
    );
};

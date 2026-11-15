import type { SupplierProcurementStatus } from '../types';

const labels: Record<SupplierProcurementStatus, string> = {
    pending: 'Menunggu respons',
    approved: 'Diterima / diproses',
    rejected: 'Ditolak',
    shipped: 'Dikirim',
    completed: 'Selesai',
};

const classes: Record<SupplierProcurementStatus, string> = {
    pending: 'bg-[#FFF7ED] text-[#C2410C]',
    approved: 'bg-[#EFF6FF] text-[#1D4ED8]',
    rejected: 'bg-[#FEF2F2] text-[#B91C1C]',
    shipped: 'bg-[#F5F3FF] text-[#6D28D9]',
    completed: 'bg-[#F0FDF4] text-[#15803D]',
};

const SupplierStatusBadge = ({
    status,
}: {
    status: SupplierProcurementStatus;
}) => (
    <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${classes[status]}`}
    >
        {labels[status]}
    </span>
);

export default SupplierStatusBadge;

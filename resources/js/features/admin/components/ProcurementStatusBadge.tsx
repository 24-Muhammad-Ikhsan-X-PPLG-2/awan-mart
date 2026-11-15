import type { ProcurementStatus } from '../types';

const labels: Record<ProcurementStatus, string> = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    completed: 'Selesai',
};

const classes: Record<ProcurementStatus, string> = {
    pending: 'bg-[#F8F3E8] text-[#92733B]',
    approved: 'bg-[#EEF2F8] text-[#526B91]',
    completed: 'bg-[#EDF4EF] text-[#557963]',
};

const ProcurementStatusBadge = ({ status }: { status: ProcurementStatus }) => (
    <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${classes[status]}`}
    >
        {labels[status]}
    </span>
);

export default ProcurementStatusBadge;

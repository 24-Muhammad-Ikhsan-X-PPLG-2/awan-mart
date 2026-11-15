import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    PackageCheck,
    ClipboardList,
} from 'lucide-react';
import SupplierLayout from '@/features/supplier/components/SupplierLayout';
import SupplierProcurementList from '@/features/supplier/components/SupplierProcurementList';
import type { SupplierProcurementIndexProps } from '@/features/supplier/types';

const numberFormat = new Intl.NumberFormat('id-ID');

const SupplierProcurementIndex = ({
    supplier,
    generatedAt,
    stats,
    success,
    ...listProps
}: SupplierProcurementIndexProps) => {
    const cards = [
        {
            label: 'Total Permintaan',
            value: stats.total,
            icon: ClipboardList,
            color: 'bg-[#FFF7ED] text-[#F97316]',
        },
        {
            label: 'Menunggu Respons',
            value: stats.pending,
            icon: Clock3,
            color: 'bg-[#FFFBEB] text-[#D97706]',
        },
        {
            label: 'Diterima / Diproses',
            value: stats.approved,
            icon: CheckCircle2,
            color: 'bg-[#EFF6FF] text-[#2563EB]',
        },
        {
            label: 'Telah Dikirim',
            value: stats.shipped,
            icon: PackageCheck,
            color: 'bg-[#F5F3FF] text-[#7C3AED]',
        },
    ];

    return (
        <>
            <Head title="Permintaan Pengadaan Supplier" />
            <SupplierLayout
                supplier={supplier}
                title="Permintaan Pengadaan"
                description="Kelola permintaan pengadaan dari AwanMart."
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-[#78716C]">
                            Ringkasan permintaan yang ditujukan kepada Anda.
                        </p>
                        <p className="mt-1 text-[10px] text-[#A8A29E]">
                            Diperbarui{' '}
                            {new Intl.DateTimeFormat('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            }).format(new Date(generatedAt))}
                        </p>
                    </div>
                </div>
                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-xs font-medium text-[#15803D]"
                    >
                        {success}
                    </div>
                )}
                <section
                    aria-label="Ringkasan permintaan pengadaan"
                    className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {cards.map(({ label, value, icon: Icon, color }) => (
                        <article
                            key={label}
                            className="rounded-2xl border border-[#E7E5E4] bg-white p-4 shadow-[0_2px_8px_rgba(41,37,36,0.03)] sm:p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-xs font-medium text-[#78716C]">
                                    {label}
                                </p>
                                <span
                                    className={`flex size-9 items-center justify-center rounded-xl ${color}`}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                </span>
                            </div>
                            <p className="mt-3 text-2xl leading-none font-semibold tracking-tight text-[#292524]">
                                {numberFormat.format(value)}
                            </p>
                        </article>
                    ))}
                </section>
                <SupplierProcurementList {...listProps} />
            </SupplierLayout>
        </>
    );
};

export default SupplierProcurementIndex;

import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import ProcurementForm from '@/features/admin/components/ProcurementForm';
import type { ProcurementCreateProps } from '@/features/admin/types';

const AdminProcurementCreate = ({
    admin,
    generatedAt,
    suppliers,
    products,
}: ProcurementCreateProps) => (
    <>
        <Head title="Buat Pengadaan Baru" />
        <AdminLayout
            admin={admin}
            generatedAt={generatedAt}
            title="Buat Pengadaan Baru"
            description="Catat permintaan pembelian stok dari supplier."
            activePage="procurements"
        >
            <div className="mb-5">
                <a
                    href="/admin/procurements"
                    className="inline-flex min-h-8 items-center gap-1.5 text-[11px] font-medium text-[#778396] transition hover:text-[#203452]"
                >
                    <ArrowLeft size={14} />
                    Kembali ke daftar pengadaan
                </a>
            </div>
            <ProcurementForm suppliers={suppliers} products={products} />
        </AdminLayout>
    </>
);

export default AdminProcurementCreate;

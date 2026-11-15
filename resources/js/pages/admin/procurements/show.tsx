import { Head } from '@inertiajs/react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import ProcurementDetailsPanel from '@/features/admin/components/ProcurementDetailsPanel';
import type { ProcurementDetailProps } from '@/features/admin/types';

const AdminProcurementDetails = ({
    admin,
    generatedAt,
    success,
    procurement,
}: ProcurementDetailProps) => (
    <>
        <Head title={`Pengadaan ${procurement.number}`} />
        <AdminLayout
            admin={admin}
            generatedAt={generatedAt}
            title="Detail Pengadaan"
            description="Informasi supplier, item pengadaan, dan status penerimaan."
            activePage="procurements"
        >
            <ProcurementDetailsPanel
                procurement={procurement}
                success={success}
            />
        </AdminLayout>
    </>
);

export default AdminProcurementDetails;

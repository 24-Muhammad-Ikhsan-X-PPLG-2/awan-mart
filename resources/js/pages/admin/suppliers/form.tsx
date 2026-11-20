import { Head } from '@inertiajs/react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminSupplierForm from '@/features/admin/components/AdminSupplierForm';
import type { AdminSupplierFormProps } from '@/features/admin/types';

const AdminSupplierFormPage = ({
    admin,
    generatedAt,
    supplier,
}: AdminSupplierFormProps) => {
    const title = supplier ? 'Edit Supplier' : 'Tambah Supplier';

    return (
        <>
            <Head title={title} />
            <AdminLayout
                admin={admin}
                generatedAt={generatedAt}
                title={title}
                description="Kelola identitas, kontak, dan akses akun supplier."
                activePage="suppliers"
            >
                <AdminSupplierForm supplier={supplier} />
            </AdminLayout>
        </>
    );
};

export default AdminSupplierFormPage;

import { Head } from '@inertiajs/react';
import AdminCourierForm from '@/features/admin/components/AdminCourierForm';
import AdminLayout from '@/features/admin/components/AdminLayout';
import type { DashboardProps } from '@/features/admin/types';

type Props = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    courier: {
        id: number;
        name: string;
        supplier_id: string;
        shipping_cost: string;
        is_active: boolean;
    } | null;
    suppliers: Array<{ id: number; name: string; email: string }>;
};

const AdminCourierFormPage = ({
    admin,
    generatedAt,
    courier,
    suppliers,
}: Props) => {
    const title = courier ? 'Edit Kurir' : 'Tambah Kurir';
    return (
        <>
            <Head title={title} />
            <AdminLayout
                admin={admin}
                generatedAt={generatedAt}
                title={title}
                description="Atur layanan pengiriman, akun supplier-kurir, dan tarifnya."
                activePage="couriers"
            >
                <AdminCourierForm courier={courier} suppliers={suppliers} />
            </AdminLayout>
        </>
    );
};

export default AdminCourierFormPage;

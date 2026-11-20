import { Head } from '@inertiajs/react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminCustomerForm from '@/features/admin/components/AdminCustomerForm';
import type { AdminCustomerFormProps } from '@/features/admin/types';

const AdminCustomerFormPage = ({ admin, generatedAt, customer }: AdminCustomerFormProps) => (
    <>
        <Head title={customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'} />
        <AdminLayout admin={admin} generatedAt={generatedAt} title={customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'} description="Kelola identitas, email, dan akses akun pelanggan." activePage="customers">
            <AdminCustomerForm customer={customer} />
        </AdminLayout>
    </>
);

export default AdminCustomerFormPage;

import { Head } from '@inertiajs/react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminCategoryForm from '@/features/admin/components/AdminCategoryForm';
import type { AdminCategoryFormProps } from '@/features/admin/types';

const AdminCategoryFormPage = ({ admin, generatedAt, category }: AdminCategoryFormProps) => (
    <>
        <Head title={category ? 'Edit Kategori' : 'Tambah Kategori'} />
        <AdminLayout admin={admin} generatedAt={generatedAt} title={category ? 'Edit Kategori' : 'Tambah Kategori'} description="Atur nama dan deskripsi kategori produk." activePage="categories">
            <AdminCategoryForm category={category} />
        </AdminLayout>
    </>
);

export default AdminCategoryFormPage;

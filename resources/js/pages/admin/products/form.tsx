import { Head } from '@inertiajs/react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminProductForm from '@/features/admin/components/AdminProductForm';
import type { AdminProductFormProps } from '@/features/admin/types';

const AdminProductFormPage = ({ admin, generatedAt, product, categories }: AdminProductFormProps) => (
    <>
        <Head title={product ? 'Edit Produk' : 'Tambah Produk'} />
        <AdminLayout admin={admin} generatedAt={generatedAt} title={product ? 'Edit Produk' : 'Tambah Produk'} description="Lengkapi informasi katalog produk." activePage="products">
            <AdminProductForm product={product} categories={categories} />
        </AdminLayout>
    </>
);

export default AdminProductFormPage;

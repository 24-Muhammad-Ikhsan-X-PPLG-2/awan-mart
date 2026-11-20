import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminResourcePagination from '@/features/admin/components/AdminResourcePagination';
import type { AdminCategoriesProps } from '@/features/admin/types';

const AdminCategoriesPage = ({ admin, generatedAt, categories, filters }: AdminCategoriesProps) => {
    const [search, setSearch] = useState(filters.search);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get('/admin/categories', { search: search.trim() || undefined }, { preserveScroll: true, preserveState: true, replace: true });
    };
    const remove = (id: number) => {
        if (window.confirm('Yakin ingin menghapus kategori ini? Kategori yang masih digunakan tidak dapat dihapus.')) {
            router.delete(`/admin/categories/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Kelola Kategori" />
            <AdminLayout admin={admin} generatedAt={generatedAt} title="Kelola Kategori" description="Kelompokkan produk agar katalog lebih mudah dijelajahi." activePage="categories">
                <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#E5E8EE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="text-sm font-semibold text-[#203452]">Daftar kategori</h2>
                            <p className="mt-1 text-[11px] text-[#8A95A5]">{categories.total} kategori</p>
                        </div>
                        <Link href="/admin/categories/create" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white hover:bg-[#314D73]"><Plus size={15} /> Tambah kategori</Link>
                    </div>
                    <form onSubmit={submit} className="flex gap-2 border-b border-[#E5E8EE] p-4">
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Cari kategori</span>
                            <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kategori..." className="h-10 w-full rounded-lg border border-[#E2E6EE] pl-9 pr-3 text-xs outline-none focus:border-[#526B91]" />
                        </label>
                        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]"><Search size={14} /> Cari</button>
                    </form>
                    <div className="divide-y divide-[#EEF0F4]">
                        {categories.data.map((category) => (
                            <div key={category.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#526B91]"><Tag size={18} /></span>
                                    <div className="min-w-0">
                                        <h3 className="text-xs font-semibold text-[#344054]">{category.name}</h3>
                                        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#8A95A5]">{category.description || 'Belum ada deskripsi kategori.'}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium text-[#667085]">{category.productsCount} produk</span>
                                <div className="flex gap-1">
                                    <Link href={`/admin/categories/${category.id}/edit`} aria-label={`Edit ${category.name}`} className="flex size-8 items-center justify-center rounded-lg text-[#526B91] hover:bg-[#EEF2F8]"><Edit3 size={15} /></Link>
                                    <button type="button" onClick={() => remove(category.id)} aria-label={`Hapus ${category.name}`} className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                                </div>
                            </div>
                        ))}
                        {!categories.data.length && <p className="px-5 py-14 text-center text-xs text-[#8A95A5]">Kategori tidak ditemukan.</p>}
                    </div>
                    <AdminResourcePagination pagination={categories} />
                </section>
            </AdminLayout>
        </>
    );
};

export default AdminCategoriesPage;

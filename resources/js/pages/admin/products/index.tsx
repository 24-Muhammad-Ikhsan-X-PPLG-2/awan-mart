import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Package, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminResourcePagination from '@/features/admin/components/AdminResourcePagination';
import type { AdminProductsProps } from '@/features/admin/types';
import { formatCurrency } from '@/features/admin/formatters';

const AdminProductsPage = ({
    admin,
    generatedAt,
    products,
    categories,
    filters,
}: AdminProductsProps) => {
    const [search, setSearch] = useState(filters.search);
    const visit = (nextSearch = search.trim(), category = filters.category) =>
        router.get(
            '/admin/products',
            { search: nextSearch || undefined, category: category || undefined },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        visit();
    };
    const remove = (id: number) => {
        if (window.confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(`/admin/products/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Kelola Produk" />
            <AdminLayout admin={admin} generatedAt={generatedAt} title="Kelola Produk" description="Atur katalog, harga, stok, dan foto produk." activePage="products">
                <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#E5E8EE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="text-sm font-semibold text-[#203452]">Daftar produk</h2>
                            <p className="mt-1 text-[11px] text-[#8A95A5]">{products.total} produk di katalog</p>
                        </div>
                        <Link href="/admin/products/create" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white hover:bg-[#314D73]">
                            <Plus size={15} /> Tambah produk
                        </Link>
                    </div>
                    <form onSubmit={submit} className="flex flex-col gap-2 border-b border-[#E5E8EE] p-4 sm:flex-row">
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Cari produk</span>
                            <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau slug produk..." className="h-10 w-full rounded-lg border border-[#E2E6EE] pl-9 pr-3 text-xs outline-none focus:border-[#526B91]" />
                        </label>
                        <select value={filters.category ?? ''} onChange={(event) => visit(search.trim(), Number(event.target.value) || null)} className="h-10 rounded-lg border border-[#E2E6EE] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91]">
                            <option value="">Semua kategori</option>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]">
                            <Search size={14} /> Cari
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#F8F9FC] text-[10px] font-semibold tracking-wide text-[#8A95A5] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Produk</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Harga</th>
                                    <th className="px-4 py-3">Stok</th>
                                    <th className="px-4 py-3">Pesanan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EEF0F4]">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="text-xs">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E5E8EE] bg-[#F8F9FC]">
                                                    {product.image ? <img src={product.image} alt="" className="size-full object-cover" /> : <Package size={18} className="text-[#98A2B3]" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="max-w-64 truncate font-semibold text-[#344054]">{product.name}</p>
                                                    <p className="mt-1 text-[10px] text-[#98A2B3]">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[#667085]">{product.category}</td>
                                        <td className="px-4 py-3 font-semibold text-[#344054]">{formatCurrency(product.price)}</td>
                                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${product.stock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{product.stock}</span></td>
                                        <td className="px-4 py-3 text-[#667085]">{product.ordersCount}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`} className="flex size-8 items-center justify-center rounded-lg text-[#526B91] hover:bg-[#EEF2F8]"><Edit3 size={15} /></Link>
                                                <button type="button" onClick={() => remove(product.id)} aria-label={`Hapus ${product.name}`} className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!products.data.length && <tr><td colSpan={6} className="px-5 py-14 text-center text-xs text-[#8A95A5]">Produk tidak ditemukan.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <AdminResourcePagination pagination={products} />
                </section>
            </AdminLayout>
        </>
    );
};

export default AdminProductsPage;

import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Mail, Plus, Search, Trash2, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminResourcePagination from '@/features/admin/components/AdminResourcePagination';
import type { AdminCustomersProps } from '@/features/admin/types';

const AdminCustomersPage = ({ admin, generatedAt, customers, filters }: AdminCustomersProps) => {
    const [search, setSearch] = useState(filters.search);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get('/admin/customers', { search: search.trim() || undefined }, { preserveScroll: true, preserveState: true, replace: true });
    };
    const remove = (id: number) => {
        if (window.confirm('Yakin ingin menghapus akun pelanggan ini? Akun dengan riwayat pesanan tidak dapat dihapus.')) {
            router.delete(`/admin/customers/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Kelola Pelanggan" />
            <AdminLayout admin={admin} generatedAt={generatedAt} title="Kelola Pelanggan" description="Kelola akun dan informasi pelanggan AwanMart." activePage="customers">
                <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#E5E8EE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="text-sm font-semibold text-[#203452]">Akun pelanggan</h2>
                            <p className="mt-1 text-[11px] text-[#8A95A5]">{customers.total} pelanggan terdaftar</p>
                        </div>
                        <Link href="/admin/customers/create" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white hover:bg-[#314D73]"><Plus size={15} /> Tambah pelanggan</Link>
                    </div>
                    <form onSubmit={submit} className="flex gap-2 border-b border-[#E5E8EE] p-4">
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Cari pelanggan berdasarkan nama, email, atau telepon</span>
                            <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, email, atau telepon..." className="h-10 w-full rounded-lg border border-[#E2E6EE] pl-9 pr-3 text-xs outline-none focus:border-[#526B91]" />
                        </label>
                        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]"><Search size={14} /> Cari</button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left">
                            <thead className="bg-[#F8F9FC] text-[10px] font-semibold tracking-wide text-[#8A95A5] uppercase">
                                <tr><th className="px-5 py-3">Pelanggan</th><th className="px-4 py-3">Telepon</th><th className="px-4 py-3">Pesanan</th><th className="px-4 py-3">Terdaftar</th><th className="px-4 py-3 text-right">Aksi</th></tr>
                            </thead>
                            <tbody className="divide-y divide-[#EEF0F4]">
                                {customers.data.map((customer) => (
                                    <tr key={customer.id} className="text-xs">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF2F8] text-[#526B91]"><Users size={17} /></span>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-[#344054]">{customer.name}</p>
                                                    <p className="mt-1 flex items-center gap-1 text-[10px] text-[#8A95A5]"><Mail size={12} />{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[#667085]">{customer.phone || '—'}</td>
                                        <td className="px-4 py-3"><span className="rounded-full bg-[#F0F3F8] px-2.5 py-1 text-[10px] font-semibold text-[#526B91]">{customer.ordersCount}</span></td>
                                        <td className="px-4 py-3 text-[#667085]">{customer.joinedAt ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(customer.joinedAt)) : '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/admin/customers/${customer.id}/edit`} aria-label={`Edit ${customer.name}`} className="flex size-8 items-center justify-center rounded-lg text-[#526B91] hover:bg-[#EEF2F8]"><Edit3 size={15} /></Link>
                                                <button type="button" onClick={() => remove(customer.id)} aria-label={`Hapus ${customer.name}`} className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!customers.data.length && <tr><td colSpan={5} className="px-5 py-14 text-center text-xs text-[#8A95A5]">Pelanggan tidak ditemukan.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <AdminResourcePagination pagination={customers} />
                </section>
            </AdminLayout>
        </>
    );
};

export default AdminCustomersPage;

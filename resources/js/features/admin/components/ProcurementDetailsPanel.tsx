import { useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Clock3,
    LoaderCircle,
    MapPin,
    PackageCheck,
    Phone,
    X,
} from 'lucide-react';
import { useState } from 'react';
import ProcurementStatusBadge from './ProcurementStatusBadge';
import type { ProcurementDetailProps, ProcurementStatus } from '../types';
import { formatCurrency, formatDate, formatNumber } from '../formatters';

const statusDetails: Record<
    ProcurementStatus,
    { title: string; description: string }
> = {
    pending: {
        title: 'Menunggu respons supplier',
        description: 'Permintaan menunggu supplier menerima atau menolak.',
    },
    approved: {
        title: 'Diterima supplier',
        description: 'Supplier menerima permintaan. Stok belum berubah.',
    },
    rejected: {
        title: 'Ditolak supplier',
        description: 'Supplier menolak permintaan pengadaan ini.',
    },
    shipped: {
        title: 'Barang dikirim',
        description:
            'Supplier mengonfirmasi pengiriman. Stok belum berubah sampai admin menerima barang.',
    },
    completed: {
        title: 'Selesai',
        description: 'Barang diterima dan stok produk telah diperbarui.',
    },
};

const ProcurementDetailsPanel = ({
    procurement,
    success,
}: {
    procurement: ProcurementDetailProps['procurement'];
    success: string | null;
}) => {
    const form = useForm<{ status: 'completed' }>({ status: 'completed' });
    const [confirmStatus, setConfirmStatus] = useState<'completed' | null>(
        null,
    );

    const submitStatus = () => {
        if (!confirmStatus) {
            return;
        }
        form.transform(() => ({ status: confirmStatus }));
        form.patch(`/admin/procurements/${procurement.id}/status`, {
            preserveScroll: true,
            onSuccess: () => setConfirmStatus(null),
        });
    };

    const activeStatus = statusDetails[procurement.status];

    return (
        <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                    href="/admin/procurements"
                    className="inline-flex min-h-8 items-center gap-1.5 self-start text-[11px] font-medium text-[#778396] transition hover:text-[#203452]"
                >
                    <ArrowLeft size={14} />
                    Kembali ke daftar pengadaan
                </a>
                <div className="flex flex-wrap gap-2">
                    {procurement.canComplete && (
                        <button
                            type="button"
                            onClick={() => setConfirmStatus('completed')}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73]"
                        >
                            <PackageCheck size={15} />
                            Tandai Barang Diterima
                        </button>
                    )}
                </div>
            </div>

            {success && (
                <div
                    role="status"
                    className="mb-4 rounded-lg border border-[#D7E6DB] bg-[#F0F6F1] px-4 py-3 text-xs font-medium text-[#557963]"
                >
                    {success}
                </div>
            )}
            {form.errors.status && (
                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-[#E8D8D4] bg-[#F9F1EF] px-4 py-3 text-xs font-medium text-[#9A5E50]"
                >
                    {form.errors.status}
                </div>
            )}

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.8fr)]">
                <div className="space-y-5">
                    <section className="rounded-xl border border-[#E5E8EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.12em] text-[#98A2B3]">
                                    NOMOR PENGADAAN
                                </p>
                                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#203452]">
                                    {procurement.number}
                                </h2>
                                <p className="mt-1 text-xs text-[#8A95A5]">
                                    Tanggal pengadaan{' '}
                                    {formatDate(procurement.date)}
                                </p>
                            </div>
                            <ProcurementStatusBadge
                                status={procurement.status}
                            />
                        </div>
                        <div className="mt-5 rounded-lg bg-[#F8F9FC] p-4">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#526B91]">
                                    {procurement.status === 'completed' ? (
                                        <PackageCheck size={16} />
                                    ) : (
                                        <Clock3 size={16} />
                                    )}
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-[#344054]">
                                        {activeStatus.title}
                                    </p>
                                    <p className="mt-1 text-[11px] leading-5 text-[#778396]">
                                        {activeStatus.description}
                                    </p>
                                    {procurement.shippedAt && (
                                        <p className="mt-2 text-[10px] font-medium text-[#526B91]">
                                            Dikonfirmasi dikirim:{' '}
                                            {formatDate(procurement.shippedAt, {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    )}
                                    {procurement.rejectionReason && (
                                        <p className="mt-2 text-[10px] leading-5 text-[#9A5E50]">
                                            Alasan penolakan:{' '}
                                            {procurement.rejectionReason}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-3 border-t border-[#EEF0F4] pt-4 sm:grid-cols-2">
                            <div>
                                <p className="text-[10px] text-[#98A2B3]">
                                    Dibuat oleh
                                </p>
                                <p className="mt-1 text-xs font-medium text-[#526072]">
                                    {procurement.createdBy}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-[#98A2B3]">
                                    Catatan
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#526072]">
                                    {procurement.notes || 'Tidak ada catatan.'}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                        <div className="border-b border-[#EEF0F4] px-4 py-4 sm:px-6">
                            <h2 className="text-sm font-semibold text-[#203452]">
                                Item Pengadaan
                            </h2>
                            <p className="mt-1 text-[11px] text-[#8A95A5]">
                                {formatNumber(procurement.items.length)} jenis
                                produk
                            </p>
                        </div>
                        {procurement.items.length ? (
                            <>
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full min-w-[570px] border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-[#EEF0F4] bg-[#FBFCFD] text-[10px] font-semibold tracking-[0.08em] text-[#8A95A5]">
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    PRODUK
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3"
                                                >
                                                    JUMLAH
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3"
                                                >
                                                    HARGA
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-right"
                                                >
                                                    SUBTOTAL
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F0F2F5]">
                                            {procurement.items.map((item) => (
                                                <tr key={item.id}>
                                                    <th
                                                        scope="row"
                                                        className="px-6 py-3.5 text-left text-xs font-medium text-[#344054]"
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <ProductImage
                                                                image={
                                                                    item.image
                                                                }
                                                                name={
                                                                    item.productName
                                                                }
                                                            />
                                                            {item.productName}
                                                        </span>
                                                    </th>
                                                    <td className="px-4 py-3.5 text-xs text-[#667085]">
                                                        {formatNumber(
                                                            item.quantity,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-xs whitespace-nowrap text-[#667085]">
                                                        {formatCurrency(
                                                            item.price,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right text-xs font-medium whitespace-nowrap text-[#344054]">
                                                        {formatCurrency(
                                                            item.subtotal,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="divide-y divide-[#F0F2F5] sm:hidden">
                                    {procurement.items.map((item) => (
                                        <article
                                            key={item.id}
                                            className="flex items-start gap-3 p-4"
                                        >
                                            <ProductImage
                                                image={item.image}
                                                name={item.productName}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-xs font-medium text-[#344054]">
                                                    {item.productName}
                                                </h3>
                                                <p className="mt-1 text-[10px] text-[#8A95A5]">
                                                    {formatNumber(
                                                        item.quantity,
                                                    )}{' '}
                                                    ×{' '}
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-xs font-semibold text-[#203452]">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="px-6 py-10 text-center text-xs text-[#8A95A5]">
                                Tidak ada item pada pengadaan ini.
                            </p>
                        )}
                        <div className="flex flex-col gap-2 border-t border-[#EEF0F4] bg-[#FBFCFD] px-4 py-4 text-xs sm:flex-row sm:justify-end sm:gap-10 sm:px-6">
                            <p className="text-[#778396]">
                                Total item:{' '}
                                <span className="font-semibold text-[#344054]">
                                    {formatNumber(
                                        procurement.summary.totalQuantity,
                                    )}
                                </span>
                            </p>
                            <p className="text-[#778396]">
                                Total biaya:{' '}
                                <span className="font-semibold text-[#203452]">
                                    {formatCurrency(
                                        procurement.summary.totalCost,
                                    )}
                                </span>
                            </p>
                        </div>
                    </section>
                </div>

                <aside className="space-y-5">
                    <section className="rounded-xl border border-[#E5E8EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-5">
                        <h2 className="text-sm font-semibold text-[#203452]">
                            Informasi Supplier
                        </h2>
                        <p className="mt-4 text-sm font-semibold text-[#344054]">
                            {procurement.supplier.name}
                        </p>
                        <p className="mt-1 text-[11px] break-all text-[#778396]">
                            {procurement.supplier.email}
                        </p>
                        {procurement.supplier.phone && (
                            <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#667085]">
                                <Phone
                                    size={13}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-[#98A2B3]"
                                />
                                {procurement.supplier.phone}
                            </p>
                        )}
                        {procurement.supplier.address && (
                            <p className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-[#667085]">
                                <MapPin
                                    size={13}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-[#98A2B3]"
                                />
                                {procurement.supplier.address}
                            </p>
                        )}
                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#EEF0F4] pt-4">
                            <div className="rounded-lg bg-[#F8F9FC] px-3 py-2.5">
                                <p className="text-[10px] text-[#8A95A5]">
                                    Total pengadaan
                                </p>
                                <p className="mt-1 text-base font-semibold text-[#203452]">
                                    {formatNumber(
                                        procurement.supplier.procurementCount,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-lg bg-[#F8F9FC] px-3 py-2.5">
                                <p className="text-[10px] text-[#8A95A5]">
                                    Total nilai
                                </p>
                                <p className="mt-1 truncate text-sm font-semibold text-[#203452]">
                                    {formatCurrency(
                                        procurement.supplier.procurementValue,
                                    )}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-[#E5E8EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-5">
                        <h2 className="text-sm font-semibold text-[#203452]">
                            Aktivitas
                        </h2>
                        <ol className="mt-4 space-y-4">
                            <li className="flex gap-3">
                                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2F8] text-[#526B91]">
                                    <Check size={12} />
                                </span>
                                <div>
                                    <p className="text-xs font-medium text-[#344054]">
                                        Pengadaan dibuat
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#98A2B3]">
                                        {formatDate(procurement.createdAt, {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </li>
                            {procurement.status !== 'pending' && (
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2F8] text-[#526B91]">
                                        {procurement.status === 'completed' ? (
                                            <PackageCheck size={12} />
                                        ) : (
                                            <Check size={12} />
                                        )}
                                    </span>
                                    <div>
                                        <p className="text-xs font-medium text-[#344054]">
                                            {procurement.status === 'completed'
                                                ? 'Barang diterima, stok diperbarui'
                                                : 'Pengadaan disetujui'}
                                        </p>
                                        <p className="mt-1 text-[10px] text-[#98A2B3]">
                                            Terakhir diperbarui{' '}
                                            {formatDate(procurement.updatedAt, {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </li>
                            )}
                        </ol>
                        <p className="mt-4 border-t border-[#EEF0F4] pt-3 text-[10px] leading-4 text-[#98A2B3]">
                            Riwayat perubahan status terperinci belum tersedia
                            pada sistem.
                        </p>
                    </section>
                </aside>
            </div>

            {confirmStatus && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#15243A]/45 p-4">
                    <button
                        type="button"
                        aria-label="Tutup dialog"
                        onClick={() => setConfirmStatus(null)}
                        disabled={form.processing}
                        className="absolute inset-0 cursor-default"
                    />
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="procurement-confirm-title"
                        className="relative z-10 w-full max-w-md rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-xl sm:p-6"
                    >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#203452]">
                            <PackageCheck size={19} />
                        </div>
                        <h2
                            id="procurement-confirm-title"
                            className="mt-4 text-base font-semibold text-[#203452]"
                        >
                            Tandai barang telah diterima?
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                            Pengadaan akan diselesaikan dan jumlah stok setiap
                            produk akan bertambah sesuai kuantitas pengadaan.
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#92733B]">
                            Pastikan barang sudah diterima. Penambahan stok
                            diproses satu kali bersama perubahan status.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={form.processing}
                                onClick={() => setConfirmStatus(null)}
                                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-[#E2E6ED] px-4 text-xs font-semibold text-[#526072] transition hover:bg-[#F8F9FC] disabled:opacity-60"
                            >
                                <X size={14} />
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={form.processing}
                                onClick={submitStatus}
                                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-wait disabled:opacity-70"
                            >
                                {form.processing ? (
                                    <LoaderCircle
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Check size={14} />
                                )}
                                Konfirmasi
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
};

const ProductImage = ({
    image,
    name,
}: {
    image: string | null;
    name: string;
}) =>
    image ? (
        <img
            src={image}
            alt=""
            className="size-9 shrink-0 rounded-md border border-[#EEF0F4] object-cover"
        />
    ) : (
        <span
            aria-label={`Gambar ${name} tidak tersedia`}
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#F3F5F8] text-[#98A2B3]"
        >
            <PackageCheck size={15} />
        </span>
    );

export default ProcurementDetailsPanel;

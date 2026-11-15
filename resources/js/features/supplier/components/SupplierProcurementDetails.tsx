import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Clock3,
    LoaderCircle,
    Package,
    PackageCheck,
    Send,
    X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import SupplierStatusBadge from './SupplierStatusBadge';
import type { SupplierProcurementDetailProps } from '../types';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
const number = (value: number) => new Intl.NumberFormat('id-ID').format(value);
const date = (value: string | null) =>
    value
        ? new Intl.DateTimeFormat('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          }).format(new Date(value))
        : '—';

type Action = 'accept' | 'reject' | 'ship';

const SupplierProcurementDetails = ({
    procurement,
    success,
}: Pick<SupplierProcurementDetailProps, 'procurement' | 'success'>) => {
    const form = useForm<{ reason: string; status?: string }>({ reason: '' });
    const [action, setAction] = useState<Action | null>(null);
    const statusText = {
        pending:
            'Permintaan menunggu respons supplier. Terima atau tolak untuk melanjutkan.',
        approved:
            'Permintaan diterima. Siapkan produk sesuai jumlah yang diminta sebelum mengonfirmasi pengiriman.',
        rejected: 'Permintaan ini telah ditolak.',
        shipped:
            'Pengiriman sudah dikonfirmasi. Stok akan diperbarui setelah admin menerima dan memverifikasi barang.',
        completed: 'Pengadaan selesai dan telah diterima oleh admin.',
    }[procurement.status];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!action) return;
        const urls: Record<Action, string> = {
            accept: `/supplier/procurements/${procurement.id}/accept`,
            reject: `/supplier/procurements/${procurement.id}/reject`,
            ship: `/supplier/procurements/${procurement.id}/ship`,
        };
        form.patch(urls[action], {
            preserveScroll: true,
            onSuccess: () => {
                setAction(null);
                form.reset();
            },
        });
    };

    const actionTitle: Record<Action, string> = {
        accept: 'Terima permintaan ini?',
        reject: 'Tolak permintaan ini?',
        ship: 'Konfirmasi barang telah dikirim?',
    };
    const actionDescription: Record<Action, string> = {
        accept: 'Permintaan akan ditandai diterima. Pastikan Anda dapat memenuhi produk dan jumlah yang tercantum.',
        reject: 'Permintaan akan ditolak dan admin akan melihat alasan penolakan yang Anda berikan.',
        ship: 'Status pengadaan berubah menjadi dikirim. Stok produk tidak akan bertambah sampai admin menerima dan memverifikasi barang.',
    };

    return (
        <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/supplier/procurements"
                    className="inline-flex min-h-9 items-center gap-2 self-start text-xs font-medium text-[#78716C] transition hover:text-[#EA580C]"
                >
                    <ArrowLeft size={15} />
                    Kembali ke permintaan
                </Link>
                <div className="flex flex-col gap-2 sm:flex-row">
                    {procurement.canReject && (
                        <button
                            type="button"
                            onClick={() => setAction('reject')}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E7E5E4] bg-white px-4 text-xs font-semibold text-[#57534E] transition hover:border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                        >
                            <X size={15} />
                            Tolak Permintaan
                        </button>
                    )}
                    {procurement.canAccept && (
                        <button
                            type="button"
                            onClick={() => setAction('accept')}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 text-xs font-semibold text-white transition hover:bg-[#EA580C]"
                        >
                            <Check size={15} />
                            Terima Permintaan
                        </button>
                    )}
                    {procurement.canShip && (
                        <button
                            type="button"
                            onClick={() => setAction('ship')}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 text-xs font-semibold text-white transition hover:bg-[#EA580C]"
                        >
                            <Send size={15} />
                            Konfirmasi Pengiriman
                        </button>
                    )}
                </div>
            </div>

            {success && (
                <div
                    role="status"
                    className="mb-5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-xs font-medium text-[#15803D]"
                >
                    {success}
                </div>
            )}
            {form.errors.status && (
                <div
                    role="alert"
                    className="mb-5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-xs font-medium text-[#B91C1C]"
                >
                    {form.errors.status}
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(270px,.8fr)]">
                <div className="space-y-5">
                    <section className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-[0_2px_8px_rgba(41,37,36,0.03)] sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.13em] text-[#A8A29E]">
                                    NOMOR PENGADAAN
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#292524]">
                                    {procurement.number}
                                </h2>
                                <p className="mt-1.5 text-xs text-[#78716C]">
                                    Tanggal permintaan: {date(procurement.date)}
                                </p>
                            </div>
                            <SupplierStatusBadge status={procurement.status} />
                        </div>
                        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FFF7ED] p-4">
                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#F97316]">
                                {procurement.status === 'shipped' ||
                                procurement.status === 'completed' ? (
                                    <PackageCheck size={17} />
                                ) : (
                                    <Clock3 size={17} />
                                )}
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-[#44403C]">
                                    Status pengadaan
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#78716C]">
                                    {statusText}
                                </p>
                                {procurement.shippedAt && (
                                    <p className="mt-2 text-[10px] font-medium text-[#C2410C]">
                                        Dikonfirmasi dikirim:{' '}
                                        {date(procurement.shippedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-5 grid gap-4 border-t border-[#F0EEEC] pt-4 sm:grid-cols-2">
                            <div>
                                <p className="text-[10px] text-[#A8A29E]">
                                    Catatan dari admin
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#57534E]">
                                    {procurement.notes || 'Tidak ada catatan.'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-[#A8A29E]">
                                    Terakhir diperbarui
                                </p>
                                <p className="mt-1 text-xs text-[#57534E]">
                                    {date(procurement.updatedAt)}
                                </p>
                            </div>
                        </div>
                        {procurement.rejectionReason && (
                            <div className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3">
                                <p className="text-[10px] font-semibold text-[#B91C1C]">
                                    Alasan penolakan
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#7F1D1D]">
                                    {procurement.rejectionReason}
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-[0_2px_8px_rgba(41,37,36,0.03)]">
                        <div className="border-b border-[#F0EEEC] px-5 py-4 sm:px-6">
                            <h2 className="text-sm font-semibold text-[#292524]">
                                Produk yang diminta
                            </h2>
                            <p className="mt-1 text-[11px] text-[#78716C]">
                                {number(procurement.summary.itemsCount)} jenis
                                produk ·{' '}
                                {number(procurement.summary.totalQuantity)} unit
                            </p>
                        </div>
                        {procurement.items.length ? (
                            <>
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full min-w-[560px] text-left">
                                        <thead className="bg-[#FAFAF9] text-[9px] font-semibold tracking-[0.12em] text-[#A8A29E]">
                                            <tr>
                                                <th className="px-6 py-3">
                                                    PRODUK
                                                </th>
                                                <th className="px-4 py-3">
                                                    JUMLAH
                                                </th>
                                                <th className="px-4 py-3">
                                                    HARGA / UNIT
                                                </th>
                                                <th className="px-6 py-3 text-right">
                                                    SUBTOTAL
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F5F5F4]">
                                            {procurement.items.map((item) => (
                                                <tr key={item.id}>
                                                    <th
                                                        scope="row"
                                                        className="px-6 py-4 text-left text-xs font-medium text-[#44403C]"
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <ProductImage
                                                                image={
                                                                    item.image
                                                                }
                                                            />
                                                            {item.productName}
                                                        </span>
                                                    </th>
                                                    <td className="px-4 py-4 text-xs text-[#78716C]">
                                                        {number(item.quantity)}
                                                    </td>
                                                    <td className="px-4 py-4 text-xs whitespace-nowrap text-[#78716C]">
                                                        {money(item.price)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs font-medium whitespace-nowrap text-[#44403C]">
                                                        {money(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="divide-y divide-[#F5F5F4] sm:hidden">
                                    {procurement.items.map((item) => (
                                        <article
                                            key={item.id}
                                            className="flex items-start gap-3 p-4"
                                        >
                                            <ProductImage image={item.image} />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs font-medium text-[#44403C]">
                                                    {item.productName}
                                                </h3>
                                                <p className="mt-1 text-[10px] text-[#78716C]">
                                                    {number(item.quantity)} ×{' '}
                                                    {money(item.price)}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-xs font-semibold text-[#292524]">
                                                {money(item.subtotal)}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="px-6 py-10 text-center text-xs text-[#78716C]">
                                Belum ada item pada pengadaan ini.
                            </p>
                        )}
                        <div className="flex flex-col gap-2 border-t border-[#F0EEEC] bg-[#FAFAF9] px-5 py-4 text-xs sm:flex-row sm:justify-end sm:gap-10 sm:px-6">
                            <p className="text-[#78716C]">
                                Total unit:{' '}
                                <span className="font-semibold text-[#44403C]">
                                    {number(procurement.summary.totalQuantity)}
                                </span>
                            </p>
                            <p className="text-[#78716C]">
                                Total nilai:{' '}
                                <span className="font-semibold text-[#292524]">
                                    {money(procurement.summary.totalCost)}
                                </span>
                            </p>
                        </div>
                    </section>
                </div>

                <aside>
                    <section className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-[0_2px_8px_rgba(41,37,36,0.03)]">
                        <div className="flex items-center gap-2">
                            <Package size={16} className="text-[#F97316]" />
                            <h2 className="text-sm font-semibold text-[#292524]">
                                Ringkasan permintaan
                            </h2>
                        </div>
                        <dl className="mt-5 space-y-3 text-xs">
                            <div className="flex justify-between gap-3">
                                <dt className="text-[#78716C]">Jenis produk</dt>
                                <dd className="font-medium text-[#44403C]">
                                    {number(procurement.summary.itemsCount)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-[#78716C]">
                                    Total kuantitas
                                </dt>
                                <dd className="font-medium text-[#44403C]">
                                    {number(procurement.summary.totalQuantity)}
                                </dd>
                            </div>
                            <div className="border-t border-[#F0EEEC] pt-3">
                                <div className="flex justify-between gap-3">
                                    <dt className="font-medium text-[#57534E]">
                                        Total nilai
                                    </dt>
                                    <dd className="font-semibold text-[#C2410C]">
                                        {money(procurement.summary.totalCost)}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                        <p className="mt-5 rounded-lg bg-[#FAFAF9] p-3 text-[10px] leading-5 text-[#78716C]">
                            Harga dan kuantitas yang tercantum merupakan
                            kesepakatan permintaan dan tidak dapat diubah dari
                            portal supplier.
                        </p>
                    </section>
                </aside>
            </div>

            {action && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292524]/40 p-4">
                    <button
                        type="button"
                        aria-label="Tutup dialog"
                        onClick={() => setAction(null)}
                        disabled={form.processing}
                        className="absolute inset-0 cursor-default"
                    />
                    <form
                        onSubmit={submit}
                        className="relative z-10 w-full max-w-md rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-xl sm:p-6"
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="supplier-action-title"
                        >
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#F97316]">
                                {action === 'ship' ? (
                                    <Send size={19} />
                                ) : action === 'accept' ? (
                                    <Check size={19} />
                                ) : (
                                    <X size={19} />
                                )}
                            </span>
                            <h2
                                id="supplier-action-title"
                                className="mt-4 text-base font-semibold text-[#292524]"
                            >
                                {actionTitle[action]}
                            </h2>
                            <p className="mt-2 text-xs leading-5 text-[#78716C]">
                                {actionDescription[action]}
                            </p>
                            {action === 'reject' && (
                                <label className="mt-4 block">
                                    <span className="text-xs font-medium text-[#57534E]">
                                        Alasan penolakan
                                    </span>
                                    <textarea
                                        value={form.data.reason}
                                        onChange={(event) =>
                                            form.setData(
                                                'reason',
                                                event.target.value,
                                            )
                                        }
                                        rows={3}
                                        maxLength={500}
                                        required
                                        aria-invalid={Boolean(
                                            form.errors.reason,
                                        )}
                                        className="mt-1.5 w-full resize-y rounded-lg border border-[#E7E5E4] px-3 py-2 text-xs text-[#292524] outline-none focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]/60"
                                        placeholder="Jelaskan alasan penolakan..."
                                    />
                                    {form.errors.reason && (
                                        <span
                                            role="alert"
                                            className="mt-1 block text-[11px] text-[#B91C1C]"
                                        >
                                            {form.errors.reason}
                                        </span>
                                    )}
                                </label>
                            )}
                            {form.errors.status && (
                                <p
                                    role="alert"
                                    className="mt-3 text-xs text-[#B91C1C]"
                                >
                                    {form.errors.status}
                                </p>
                            )}
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    disabled={form.processing}
                                    onClick={() => setAction(null)}
                                    className="min-h-10 rounded-lg border border-[#E7E5E4] px-4 text-xs font-semibold text-[#57534E] hover:bg-[#FAFAF9] disabled:opacity-60"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 text-xs font-semibold text-white transition hover:bg-[#EA580C] disabled:cursor-wait disabled:opacity-60"
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
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

const ProductImage = ({ image }: { image: string | null }) =>
    image ? (
        <img
            src={image}
            alt=""
            className="size-10 shrink-0 rounded-lg border border-[#F0EEEC] object-cover"
        />
    ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F4] text-[#A8A29E]">
            <Package size={17} />
        </span>
    );

export default SupplierProcurementDetails;

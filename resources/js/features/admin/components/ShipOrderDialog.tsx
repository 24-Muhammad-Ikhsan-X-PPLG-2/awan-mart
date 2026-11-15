import { useForm } from '@inertiajs/react';
import { LoaderCircle, PackageCheck, X } from 'lucide-react';
import { FormEvent } from 'react';

const ShipOrderDialog = ({
    orderId,
    orderNumber,
    open,
    onClose,
    onSuccess,
}: {
    orderId: number;
    orderNumber: string;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) => {
    const form = useForm<{ status: 'shipped' }>({ status: 'shipped' });

    if (!open) {
        return null;
    }

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.patch(`/admin/orders/${orderId}/status`, {
            preserveScroll: true,
            onSuccess,
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#15243A]/45 p-4">
            <button
                type="button"
                aria-label="Tutup dialog"
                onClick={onClose}
                disabled={form.processing}
                className="absolute inset-0 cursor-default"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="ship-order-title"
                className="relative z-10 w-full max-w-md rounded-xl border border-[#E5E8EE] bg-white p-5 shadow-xl sm:p-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#203452]">
                        <PackageCheck size={20} />
                    </span>
                    <button
                        type="button"
                        aria-label="Tutup dialog"
                        onClick={onClose}
                        disabled={form.processing}
                        className="flex size-8 items-center justify-center rounded-lg text-[#98A2B3] transition hover:bg-[#F3F5F8] hover:text-[#526072]"
                    >
                        <X size={17} />
                    </button>
                </div>
                <h2
                    id="ship-order-title"
                    className="mt-4 text-base font-semibold text-[#203452]"
                >
                    Tandai pesanan sebagai dikirim?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Pesanan{' '}
                    <span className="font-semibold text-[#344054]">
                        {orderNumber}
                    </span>{' '}
                    akan berpindah dari status diproses menjadi dikirim. Status
                    pembayaran tidak akan berubah.
                </p>
                <p className="mt-2 text-xs leading-5 text-[#98A2B3]">
                    Informasi kurir dan nomor resi belum didukung oleh data
                    pesanan.
                </p>
                {form.errors.status && (
                    <p
                        role="alert"
                        className="mt-3 text-xs font-medium text-[#9A5E50]"
                    >
                        {form.errors.status}
                    </p>
                )}
                <form onSubmit={submit} className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        disabled={form.processing}
                        onClick={onClose}
                        className="min-h-10 rounded-lg border border-[#E2E6ED] px-4 text-xs font-semibold text-[#526072] transition hover:bg-[#F8F9FC] disabled:opacity-60"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-xs font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-wait disabled:opacity-70"
                    >
                        {form.processing && (
                            <LoaderCircle size={14} className="animate-spin" />
                        )}
                        Tandai sebagai Dikirim
                    </button>
                </form>
            </section>
        </div>
    );
};

export default ShipOrderDialog;

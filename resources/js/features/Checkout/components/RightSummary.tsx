import { formatPrice } from '@/lib/utils';
import { Address, CheckoutItem } from '@/types/types';
import { ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { FC } from 'react';

type Props = {
    items: CheckoutItem[];
    subtotal: number;
    total: number;
    shippingCost: number;
    address: Address | null;
    handleCheckout: () => void;
    isSubmitting: boolean;
    checkoutError: string | null;
    courierName: string | null;
    canSubmit: boolean;
};

const RightSummary: FC<Props> = ({
    items,
    shippingCost,
    subtotal,
    total,
    address,
    handleCheckout,
    isSubmitting,
    checkoutError,
    courierName,
    canSubmit,
}) => {
    return (
        <aside className="lg:sticky lg:top-24">
            <section className="border-y border-[#DDE3EB] bg-white p-5 sm:p-6">
                <h2 className="font-playfair text-xl font-semibold text-[#203452]">
                    Ringkasan Pesanan
                </h2>

                <p className="mt-1 text-xs text-[#98A2B3]">
                    Detail pembayaran pesananmu
                </p>

                <div className="mt-6 space-y-3 border-b border-[#E2E6ED] pb-5 text-sm">
                    <div className="flex justify-between gap-3">
                        <span className="text-[#98A2B3]">Total produk</span>
                        <span className="font-medium text-[#203452]">
                            {items.reduce(
                                (sum, item) => sum + item.quantity,
                                0,
                            )}{' '}
                            item
                        </span>
                    </div>

                    <div className="flex justify-between gap-3">
                        <span className="text-[#98A2B3]">Subtotal</span>
                        <span className="font-medium text-[#203452]">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-[#98A2B3]">
                            <Truck size={15} />
                            {courierName
                                ? `Ongkir · ${courierName}`
                                : 'Ongkos kirim'}
                        </span>
                        <span className="font-medium text-[#203452]">
                            {formatPrice(shippingCost)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 py-5">
                    <span className="text-sm font-semibold text-[#203452]">
                        Total Pembayaran
                    </span>
                    <span className="text-xl font-bold text-[#203452]">
                        {formatPrice(total)}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={
                        !address ||
                        items.length === 0 ||
                        isSubmitting ||
                        !canSubmit
                    }
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#203452] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#526B91] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                    {!isSubmitting && <ChevronRight size={17} />}
                </button>

                {checkoutError && (
                    <p className="mt-3 text-sm text-red-600" role="alert">
                        {checkoutError}
                    </p>
                )}

                <p className="mt-4 text-center text-[11px] leading-relaxed text-[#98A2B3]">
                    Dengan melanjutkan, kamu menyetujui ketentuan pembelian dan
                    kebijakan layanan AwanMart.
                </p>
            </section>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#98A2B3]">
                <ShieldCheck size={15} />
                Pembayaran aman dan terpercaya
            </div>
        </aside>
    );
};

export default RightSummary;

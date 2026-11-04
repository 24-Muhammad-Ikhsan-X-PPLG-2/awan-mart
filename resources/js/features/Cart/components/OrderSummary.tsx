import { formatPrice } from "@/lib/utils";
import { CartItem } from "../types/carts";
import { FC } from "react";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

type Props = {
    selectedItems: CartItem[];
    selectedCount: number;
    subtotal: number;
    handleCheckout: () => void;
};

const OrderSummary: FC<Props> = ({
    selectedCount,
    selectedItems,
    subtotal,
    handleCheckout,
}) => {
    return (
        <aside className="rounded-xl border border-[#E2E6ED] bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl font-semibold">
                Ringkasan Pesanan
            </h2>

            <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">Produk dipilih</span>
                    <span className="font-medium">
                        {selectedItems.length} produk
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">Total kuantitas</span>
                    <span className="font-medium">{selectedCount} item</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">Pengiriman</span>
                    <span className="text-xs font-medium text-[#526B91]">
                        Dihitung saat checkout
                    </span>
                </div>
            </div>

            <div className="my-6 border-t border-dashed border-[#E2E6ED]" />

            <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">Total sementara</span>
                <span className="text-xl font-bold tracking-tight">
                    {formatPrice(subtotal)}
                </span>
            </div>

            <button
                type="button"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
                Checkout ({selectedCount})
                <ArrowRight size={17} />
            </button>

            {selectedItems.length === 0 && (
                <p className="mt-3 text-center text-xs text-[#98A2B3]">
                    Pilih minimal satu produk untuk checkout.
                </p>
            )}

            <div className="mt-6 space-y-4 border-t border-[#E2E6ED] pt-5">
                <div className="flex items-center gap-3">
                    <Truck size={19} className="shrink-0 text-[#526B91]" />

                    <div>
                        <p className="text-xs font-semibold">
                            Pengiriman terpercaya
                        </p>
                        <p className="mt-0.5 text-xs text-[#667085]">
                            Informasi pengiriman saat checkout.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ShieldCheck
                        size={19}
                        className="shrink-0 text-[#526B91]"
                    />

                    <div>
                        <p className="text-xs font-semibold">
                            Belanja lebih aman
                        </p>
                        <p className="mt-0.5 text-xs text-[#667085]">
                            Informasi pesanan tercatat dengan baik.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default OrderSummary;

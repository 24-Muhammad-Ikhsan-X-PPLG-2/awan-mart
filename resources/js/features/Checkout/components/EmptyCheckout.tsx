import { ShoppingBag } from 'lucide-react';

const EmptyCheckout = () => {
    return (
        <div className="rounded-2xl border border-[#E2E6ED] bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag size={42} className="mx-auto mb-4 text-[#98A2B3]" />
            <h2 className="font-playfair text-xl font-bold text-[#203452]">
                Belum ada produk
            </h2>
            <p className="mt-2 text-sm text-[#98A2B3]">
                Pilih produk dari keranjang sebelum melanjutkan checkout.
            </p>
        </div>
    );
};

export default EmptyCheckout;

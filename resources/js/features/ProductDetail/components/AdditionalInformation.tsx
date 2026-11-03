import { ShieldCheck, Truck } from "lucide-react";

const AdditionalInformation = () => {
    return (
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#E2E6ED] pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F3F7]">
                    <Truck size={20} />
                </div>

                <div>
                    <p className="text-sm font-semibold">Pengiriman</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        Informasi ongkos kirim tersedia saat checkout.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F3F7]">
                    <ShieldCheck size={20} />
                </div>

                <div>
                    <p className="text-sm font-semibold">Garansi Produk</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        Informasi garansi mengikuti ketentuan produk.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdditionalInformation;

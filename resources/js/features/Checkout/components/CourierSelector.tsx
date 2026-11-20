import { Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export type CourierOption = {
    id: number;
    name: string;
    supplier: string;
    shippingCost: number;
};

const CourierSelector = ({
    couriers,
    selectedCourierId,
    onChange,
}: {
    couriers: CourierOption[];
    selectedCourierId: number | null;
    onChange: (id: number) => void;
}) => (
    <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#F0F3F8] p-2.5 text-[#203452]">
                <Truck size={19} />
            </div>
            <div>
                <h2 className="font-semibold text-[#203452]">Pilih Kurir</h2>
                <p className="mt-0.5 text-xs text-[#98A2B3]">
                    Pilih layanan pengiriman yang tersedia.
                </p>
            </div>
        </div>

        {couriers.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
                {couriers.map((courier) => {
                    const selected = courier.id === selectedCourierId;
                    return (
                        <label
                            key={courier.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                                selected
                                    ? 'border-[#203452] bg-[#F8F9FC]'
                                    : 'border-[#E2E6ED] hover:border-[#9AAAC0]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="courier"
                                value={courier.id}
                                checked={selected}
                                onChange={() => onChange(courier.id)}
                                className="size-4 accent-[#203452]"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-[#203452]">
                                    {courier.name}
                                </span>
                                <span className="mt-1 block truncate text-xs text-[#98A2B3]">
                                    Diantar oleh {courier.supplier}
                                </span>
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-[#203452]">
                                {formatPrice(courier.shippingCost)}
                            </span>
                        </label>
                    );
                })}
            </div>
        ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Belum ada kurir yang tersedia. Silakan hubungi admin sebelum
                melanjutkan pesanan.
            </p>
        )}
    </section>
);

export default CourierSelector;

import { formatPrice } from '@/lib/utils';
import { CheckoutItem } from '@/features/Checkout/types';
import { Package } from 'lucide-react';
import { FC } from 'react';

type Props = {
    items: CheckoutItem[];
};

const Products: FC<Props> = ({ items }) => {
    return (
        <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#F0F3F8] p-2.5 text-[#203452]">
                    <Package size={19} />
                </div>
                <div>
                    <h2 className="font-semibold text-[#203452]">
                        Produk Pesanan
                    </h2>
                    <p className="mt-0.5 text-xs text-[#98A2B3]">
                        {items.length} produk dipilih
                    </p>
                </div>
            </div>

            <div className="divide-y divide-[#E2E6ED]">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8F9FC]">
                            {item.product.product_images[0] ? (
                                <img
                                    src={item.product.product_images[0].image}
                                    alt={item.product.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-[#98A2B3]">
                                    <Package size={27} />
                                </div>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <h3 className="line-clamp-2 text-sm font-semibold text-[#203452]">
                                {item.product.name}
                            </h3>
                            <p className="mt-1 text-xs text-[#98A2B3]">
                                Jumlah: {item.quantity}
                            </p>
                            <p className="mt-2 text-sm font-bold text-[#203452]">
                                {formatPrice(
                                    Math.round(Number(item.product.price)) *
                                        item.quantity,
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Products;

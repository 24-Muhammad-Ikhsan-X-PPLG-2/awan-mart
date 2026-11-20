import { FC } from 'react';

type Props = {
    totalItems: number;
};

const Heading: FC<Props> = ({ totalItems }) => {
    return (
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#526B91] uppercase">
                    Your Shopping Cart
                </p>

                <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                    Keranjang Belanja
                </h1>

                <p className="mt-3 text-sm text-[#667085] sm:text-base">
                    Periksa kembali produk pilihanmu sebelum melanjutkan
                    pembelian.
                </p>
            </div>

            <p className="text-sm font-medium text-[#667085]">
                {totalItems} produk dalam keranjang
            </p>
        </div>
    );
};

export default Heading;

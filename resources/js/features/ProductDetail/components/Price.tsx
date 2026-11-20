import { formatPrice } from '@/lib/utils';
import { FC } from 'react';

type Props = {
    price: number;
};

const Price: FC<Props> = ({ price }) => {
    return (
        <div>
            <p className="text-sm text-gray-500">Harga produk</p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {formatPrice(price)}
            </h2>
        </div>
    );
};

export default Price;

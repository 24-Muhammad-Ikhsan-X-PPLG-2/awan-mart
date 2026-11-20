import { Minus, Plus } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';

type Props = {
    stock: number;
    setQuantity: Dispatch<SetStateAction<number>>;
    quantity: number;
};

const Quantity: FC<Props> = ({ stock, quantity, setQuantity }) => {
    const handleQuantity = (type: 'increment' | 'decrement') => {
        setQuantity((current) => {
            if (type === 'increment') {
                return Math.min(current + 1, stock);
            }

            return Math.max(current - 1, 1);
        });
    };
    return (
        <div>
            <p className="mb-3 text-sm font-semibold">Jumlah pembelian</p>

            <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#E2E6ED]">
                <button
                    type="button"
                    onClick={() => handleQuantity('decrement')}
                    disabled={quantity <= 1}
                    aria-label="Kurangi jumlah"
                    className="flex size-11 cursor-pointer items-center justify-center transition-colors hover:bg-[#F1F3F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Minus size={16} />
                </button>

                <span className="flex h-11 min-w-12 items-center justify-center border-x border-[#E2E6ED] text-sm font-semibold tabular-nums">
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={() => handleQuantity('increment')}
                    disabled={quantity >= stock}
                    aria-label="Tambah jumlah"
                    className="flex size-11 cursor-pointer items-center justify-center transition-colors hover:bg-[#F1F3F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default Quantity;

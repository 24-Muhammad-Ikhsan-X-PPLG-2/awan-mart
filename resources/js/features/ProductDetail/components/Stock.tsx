import { CheckCircle2 } from "lucide-react";
import { FC } from "react";

type Props = {
    stock: number;
};

const Stock: FC<Props> = ({ stock }) => {
    return (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            {stock > 0 ? (
                <>
                    <CheckCircle2 size={18} className="text-green-600" />

                    <span className="font-semibold text-green-700">
                        Tersedia
                    </span>

                    <span className="text-gray-500">
                        ({stock} produk tersisa)
                    </span>
                </>
            ) : (
                <span className="font-semibold text-red-600">Stok habis</span>
            )}
        </div>
    );
};

export default Stock;

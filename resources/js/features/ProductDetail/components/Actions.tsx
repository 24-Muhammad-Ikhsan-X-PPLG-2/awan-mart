import { FC, useState } from "react";
import { ProductType } from "../types/products";
import { Heart, ShoppingCart } from "lucide-react";

type Props = {
    product: ProductType;
    quantity: number;
};

const Actions: FC<Props> = ({ product, quantity }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = () => {
        console.log("Tambah ke keranjang:", {
            product: product.name,
            quantity,
        });
    };
    return (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2c4568] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
                <ShoppingCart size={19} />
                Tambah ke Keranjang
            </button>

            <button
                type="button"
                onClick={() => setIsWishlisted((current) => !current)}
                aria-label="Tambahkan ke wishlist"
                aria-pressed={isWishlisted}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-all ${
                    isWishlisted
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-[#E2E6ED] bg-white text-[#203452] hover:bg-[#F1F3F7]"
                }`}
            >
                <Heart
                    size={19}
                    fill={isWishlisted ? "currentColor" : "none"}
                />
                <span className="sm:hidden">Wishlist</span>
            </button>
        </div>
    );
};

export default Actions;

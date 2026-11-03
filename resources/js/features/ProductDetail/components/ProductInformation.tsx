import { FC, useState } from "react";
import { ProductType } from "../types/products";
import Rating from "./Rating";
import Price from "./Price";
import Stock from "./Stock";
import Quantity from "./Quantity";
import Actions from "./Actions";
import AdditionalInformation from "./AdditionalInformation";

type Props = {
    product: ProductType;
};

const ProductInformation: FC<Props> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex min-w-0 flex-col">
            {/* Category */}
            <p className="text-xs font-bold tracking-[0.2em] text-[#526B91] sm:text-sm">
                {product.category.name.toUpperCase()}
            </p>

            {/* Product Name */}
            <h1 className="mt-2 font-playfair text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {product.name}
            </h1>

            {/* Rating */}
            <Rating />

            <div className="my-6 border-t border-[#E2E6ED]" />

            {/* Price */}
            <Price price={Number(product.price)} />

            {/* Stock */}
            <Stock stock={product.stock} />

            {/* Description */}
            <div className="mt-6">
                <h3 className="text-base font-bold">Deskripsi Produk</h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {product.description}
                </p>
            </div>

            <div className="my-6 border-t border-[#E2E6ED]" />

            {/* Quantity */}
            <Quantity
                quantity={quantity}
                setQuantity={setQuantity}
                stock={product.stock}
            />

            {/* Actions */}
            <Actions product={product} quantity={quantity} />

            {/* Additional Information */}
            <AdditionalInformation />
        </div>
    );
};

export default ProductInformation;

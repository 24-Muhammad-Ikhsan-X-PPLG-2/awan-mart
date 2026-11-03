import { FC, useState } from "react";
import { ProductType } from "../types/products";
import ProductGallery from "./ProductGallery";
import ProductInformation from "./ProductInformation";

type Props = {
    product: ProductType;
};

const DisplayProduct: FC<Props> = ({ product }) => {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-10 text-[#203452]">
            {/* Product Main */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                {/* Product Gallery */}
                <ProductGallery
                    productImages={product.product_images}
                    productName={product.name}
                />

                {/* Product Information */}
                <ProductInformation product={product} />
            </div>
        </section>
    );
};

export default DisplayProduct;

import { FC } from "react";
import { ProductType } from "@/types/types";
import ProductGallery from "./ProductGallery";
import ProductInformation from "./ProductInformation";

type Props = {
    product: ProductType;
    averageRating: number;
    reviewCount: number;
};

const DisplayProduct: FC<Props> = ({ product, averageRating, reviewCount }) => {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 text-[#203452] sm:px-6 sm:pt-10 lg:px-10">
            {/* Product Main */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                {/* Product Gallery */}
                <ProductGallery
                    productImages={product.product_images}
                    productName={product.name}
                />

                {/* Product Information */}
                <ProductInformation
                    product={product}
                    averageRating={averageRating}
                    reviewCount={reviewCount}
                />
            </div>
        </section>
    );
};

export default DisplayProduct;

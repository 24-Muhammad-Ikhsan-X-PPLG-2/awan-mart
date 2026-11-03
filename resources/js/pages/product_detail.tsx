import Navbar from "@/components/navbar";
import BreadcrumbNav from "@/features/ProductDetail/components/BreadcrumbNav";
import DisplayProduct from "@/features/ProductDetail/components/DisplayProduct";
import { ProductType } from "@/features/ProductDetail/types/products";
import { formatPrice } from "@/lib/utils";
import { FC } from "react";

type Props = {
    product: ProductType;
};

const ProductDetail: FC<Props> = ({ product }) => {
    return (
        <main>
            <Navbar activePage="product" />
            <BreadcrumbNav
                category={product.category.name}
                productName={product.name}
            />
            <DisplayProduct product={product} />
        </main>
    );
};

export default ProductDetail;

import { ProductType } from "@/features/ProductDetail/types/products";

export type CartItem = {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: ProductType & {
        selected: boolean;
    };
};

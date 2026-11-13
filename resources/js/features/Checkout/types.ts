import { ProductType } from "../ProductDetail/types/products";

export type CheckoutItem = {
    id: number;
    quantity: number;
    subtotal: number;
    product: ProductType;
    product_id: string;
};

export type Address = {
    recipient_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
};

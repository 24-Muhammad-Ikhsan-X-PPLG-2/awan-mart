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

export type ProductType = {
    id: number;
    user_id: number;
    slug: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    category_id: number;
    category: {
        id: number;
        name: string;
        description: string;
    };
    product_images: ImageProductType[];
    created_at: string | null;
    updated_at: string | null;
};

export type ImageProductType = {
    id: number;
    image: string;
    product_id: number;
};

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

export type Category = {
    id: number;
    icon: string | null;
    name: string;
    description: string | null;
    products_count?: number;
    created_at: string;
    updated_at: string;
};

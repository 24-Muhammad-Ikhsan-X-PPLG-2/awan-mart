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

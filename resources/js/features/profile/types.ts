import { ProductType } from '@/types/types';

export type ProfileData = {
    name: string;
    email: string;
    phone: string;
    createdAt: string | null;
};

export type OrderItem = {
    id: number;
    product_id: number;
    quantity: number;
    price: string;
    product: ProductType | null;
};

export type OrderData = {
    id: number;
    order_number: string;
    total_price: string;
    shipping_address: string;
    status:
        | 'pending_payment'
        | 'processing'
        | 'shipped'
        | 'completed'
        | 'canceled';
    created_at: string;
    order_items: OrderItem[];
    reviews: {
        id: number;
        product_id: number;
    }[];
    payment: {
        provider: string;
        provider_order_id: string;
        transaction_id: string | null;
        method: string | null;
        amount: string;
        status: 'pending' | 'success' | 'failed' | 'expired' | 'canceled';
        transaction_status: string | null;
    } | null;
};

export type PaginatedOrders = {
    data: OrderData[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type ProfilePageProps = {
    profile: ProfileData;
    stats: {
        orders: number;
        completed: number;
        pending: number;
    };
    orders: PaginatedOrders;
    filters: {
        status: string;
        search: string;
    };
};

export type ProfileSection = 'overview' | 'personal' | 'orders';

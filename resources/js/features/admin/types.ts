export type DashboardRange = '7d' | '30d' | '12m';

export type OrderStatusValue =
    | 'pending_payment'
    | 'processing'
    | 'shipped'
    | 'completed'
    | 'canceled';

export type ProcurementStatusValue = 'pending' | 'approved' | 'completed';

export type DashboardProps = {
    admin: {
        name: string;
        email: string;
    };
    generatedAt: string;
    filters: {
        range: DashboardRange;
    };
    stats: {
        revenue: number;
        orders: number;
        products: number;
        customers: number;
    };
    revenueTrend: Array<{
        date: string;
        revenue: number;
    }>;
    orderStatuses: Array<{
        value: OrderStatusValue;
        label: string;
        count: number;
    }>;
    recentOrders: Array<{
        id: number;
        orderNumber: string;
        customer: string;
        date: string | null;
        total: number;
        status: OrderStatusValue;
    }>;
    inventory: {
        lowStockThreshold: number;
        lowStockCount: number;
        outOfStockCount: number;
        products: Array<{
            id: number;
            name: string;
            stock: number;
        }>;
    };
    topProducts: Array<{
        id: number;
        name: string;
        image: string | null;
        quantity: number;
        revenue: number;
    }>;
    procurements: {
        total: number;
        pending: number;
        approved: number;
        completed: number;
        recent: Array<{
            id: number;
            supplier: string;
            status: ProcurementStatusValue;
            date: string | null;
        }>;
    };
};

export type OrderPaymentStatus =
    | 'pending'
    | 'success'
    | 'failed'
    | 'expired'
    | 'canceled';

export type OrderPaymentState = OrderPaymentStatus | null;

export type OrderListItem = {
    id: number;
    orderNumber: string;
    customer: string;
    date: string | null;
    total: number;
    paymentStatus: OrderPaymentState;
    status: OrderStatusValue;
};

export type OrderPagination = {
    data: OrderListItem[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

export type OrderManagementProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    filters: {
        search: string;
        status: OrderStatusValue | null;
    };
    statusCounts: Array<{
        value: OrderStatusValue;
        label: string;
        count: number;
    }>;
    stats: {
        total: number;
        processing: number;
        shipped: number;
        completed: number;
    };
    orders: OrderPagination;
};

export type OrderDetailProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    order: {
        id: number;
        orderNumber: string;
        date: string | null;
        status: OrderStatusValue;
        canMarkAsShipped: boolean;
        shippingAddress: string;
        customer: {
            name: string;
            email: string;
            phone: string | null;
        };
        items: Array<{
            id: number;
            productName: string;
            image: string | null;
            quantity: number;
            unitPrice: number;
            subtotal: number;
        }>;
        payment: {
            status: OrderPaymentState;
            statusLabel: string;
            method: string | null;
            transactionId: string | null;
            amount: number | null;
        };
        summary: {
            subtotal: number;
            shipping: number;
            total: number;
        };
    };
};

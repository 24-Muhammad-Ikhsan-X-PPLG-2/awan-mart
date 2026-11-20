export type DashboardRange = '7d' | '30d' | '12m';

export type OrderStatusValue =
    | 'pending_payment'
    | 'processing'
    | 'shipped'
    | 'completed'
    | 'canceled';

export type ProcurementStatusValue =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'shipped'
    | 'completed';

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
        courierName: string | null;
        shippingCost: number;
        shippedAt: string | null;
        completedAt: string | null;
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

export type ProcurementStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'shipped'
    | 'completed';

export type ProcurementSupplierOption = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
};

export type ProcurementProductOption = {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string | null;
};

export type ProcurementListItem = {
    id: number;
    number: string;
    supplier: string;
    date: string;
    itemsCount: number;
    totalCost: number;
    status: ProcurementStatus;
};

export type ProcurementPagination = {
    data: ProcurementListItem[];
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
};

export type ProcurementManagementProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    filters: {
        search: string;
        status: ProcurementStatus | null;
        dateFrom: string;
        dateTo: string;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        completed: number;
    };
    procurements: ProcurementPagination;
};

export type ProcurementCreateProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    suppliers: ProcurementSupplierOption[];
    products: ProcurementProductOption[];
};

export type ProcurementDetailProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    success: string | null;
    procurement: {
        id: number;
        number: string;
        date: string;
        createdAt: string | null;
        updatedAt: string | null;
        status: ProcurementStatus;
        notes: string | null;
        canComplete: boolean;
        shippedAt: string | null;
        rejectionReason: string | null;
        createdBy: string;
        supplier: ProcurementSupplierOption & {
            procurementCount: number;
            procurementValue: number;
        };
        items: Array<{
            id: number;
            productId: number;
            productName: string;
            image: string | null;
            quantity: number;
            price: number;
            subtotal: number;
        }>;
        summary: {
            totalQuantity: number;
            totalCost: number;
        };
    };
};

export type AdminPagination<T> = {
    data: T[];
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
};

export type AdminProduct = {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    categoryId: number;
    category: string;
    image: string | null;
    ordersCount: number;
    reviewsCount: number;
};

export type AdminCategory = {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    productsCount: number;
};

export type AdminCustomer = {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string | null;
    ordersCount: number;
    joinedAt: string | null;
};

export type AdminSupplier = {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    productsCount: number;
    procurementsCount: number;
    isCourier: boolean;
    courierActive: boolean;
    joinedAt: string | null;
};

export type AdminProductsProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    products: AdminPagination<AdminProduct>;
    categories: Array<{ id: number; name: string }>;
    filters: { search: string; category: number | null };
};

export type AdminProductFormProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    product: null | {
        id: number;
        name: string;
        slug: string;
        description: string;
        price: string;
        stock: string;
        category_id: string;
        images: Array<{ id: number; url: string }>;
    };
    categories: Array<{ id: number; name: string }>;
};

export type AdminCategoriesProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    categories: AdminPagination<AdminCategory>;
    filters: { search: string };
};

export type AdminCategoryFormProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    category: null | {
        id: number;
        name: string;
        description: string;
        icon: string;
    };
};

export type AdminCustomersProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    customers: AdminPagination<AdminCustomer>;
    filters: { search: string };
};

export type AdminCustomerFormProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    customer: null | {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
};

export type AdminSuppliersProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    suppliers: AdminPagination<AdminSupplier>;
    filters: { search: string };
};

export type AdminSupplierFormProps = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    supplier: null | {
        id: number;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
};

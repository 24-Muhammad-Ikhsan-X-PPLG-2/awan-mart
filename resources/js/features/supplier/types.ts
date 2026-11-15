export type SupplierProcurementStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'shipped'
    | 'completed';

export type SupplierProfile = {
    id: number;
    name: string;
    email: string;
};

export type SupplierProcurementListItem = {
    id: number;
    number: string;
    date: string;
    itemsCount: number;
    totalQuantity: number;
    totalCost: number;
    status: SupplierProcurementStatus;
};

export type SupplierProcurementPagination = {
    data: SupplierProcurementListItem[];
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

export type SupplierProcurementIndexProps = {
    supplier: SupplierProfile;
    generatedAt: string;
    filters: {
        search: string;
        status: SupplierProcurementStatus | null;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        shipped: number;
    };
    statusCounts: Array<{
        value: SupplierProcurementStatus;
        count: number;
    }>;
    procurements: SupplierProcurementPagination;
    success: string | null;
};

export type SupplierProcurementDetailProps = {
    supplier: SupplierProfile;
    generatedAt: string;
    success: string | null;
    procurement: {
        id: number;
        number: string;
        date: string;
        updatedAt: string | null;
        shippedAt: string | null;
        status: SupplierProcurementStatus;
        notes: string | null;
        rejectionReason: string | null;
        canAccept: boolean;
        canReject: boolean;
        canShip: boolean;
        items: Array<{
            id: number;
            productName: string;
            image: string | null;
            quantity: number;
            price: number;
            subtotal: number;
        }>;
        summary: {
            itemsCount: number;
            totalQuantity: number;
            totalCost: number;
        };
    };
};

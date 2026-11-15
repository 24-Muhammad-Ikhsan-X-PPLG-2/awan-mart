import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import OrderDetailsPanel from '@/features/admin/components/OrderDetailsPanel';
import type { OrderDetailProps } from '@/features/admin/types';

const AdminOrderDetailsPage = ({
    admin,
    generatedAt,
    order,
}: OrderDetailProps) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    return (
        <>
            <Head title={`Pesanan ${order.orderNumber}`} />
            <AdminLayout
                admin={admin}
                generatedAt={generatedAt}
                title="Order Management"
                description="Manage and monitor customer orders."
                activePage="orders"
            >
                <OrderDetailsPanel
                    order={order}
                    successMessage={successMessage}
                    onShipped={() =>
                        setSuccessMessage(
                            'Pesanan berhasil ditandai sebagai dikirim.',
                        )
                    }
                />
            </AdminLayout>
        </>
    );
};

export default AdminOrderDetailsPage;

import { Head } from '@inertiajs/react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import DashboardFooter from '@/features/admin/components/DashboardFooter';
import InventoryAlerts from '@/features/admin/components/InventoryAlerts';
import OrderOverview from '@/features/admin/components/OrderOverview';
import ProcurementOverview from '@/features/admin/components/ProcurementOverview';
import RecentOrders from '@/features/admin/components/RecentOrders';
import RevenueAnalytics from '@/features/admin/components/RevenueAnalytics';
import SummaryStats from '@/features/admin/components/SummaryStats';
import TopProducts from '@/features/admin/components/TopProducts';
import type { DashboardProps } from '@/features/admin/types';

const DashboardAdminPage = ({
    admin,
    generatedAt,
    filters,
    stats,
    revenueTrend,
    orderStatuses,
    recentOrders,
    inventory,
    topProducts,
    procurements,
}: DashboardProps) => (
    <>
        <Head title="Dashboard Admin" />
        <AdminLayout
            admin={admin}
            generatedAt={generatedAt}
            title="Dashboard"
            description={`Selamat datang kembali, ${admin.name}.`}
            activePage="dashboard"
        >
            <SummaryStats stats={stats} />

            <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)]">
                <RevenueAnalytics data={revenueTrend} range={filters.range} />
                <OrderOverview
                    statuses={orderStatuses}
                    totalOrders={stats.orders}
                />
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(310px,0.9fr)]">
                <RecentOrders orders={recentOrders} statuses={orderStatuses} />
                <InventoryAlerts inventory={inventory} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <TopProducts products={topProducts} />
                <ProcurementOverview procurements={procurements} />
            </div>

            <DashboardFooter generatedAt={generatedAt} />
        </AdminLayout>
    </>
);

export default DashboardAdminPage;

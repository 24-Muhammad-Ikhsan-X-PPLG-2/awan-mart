import type { ReactNode } from 'react';
import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AdminSidebar, { type AdminSection } from './AdminSidebar';
import DashboardHeader from './DashboardHeader';
import type { DashboardProps } from '../types';

type Props = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    title: string;
    description: string;
    activePage: AdminSection;
    children: ReactNode;
};

const AdminLayout = ({
    admin,
    generatedAt,
    title,
    description,
    activePage,
    children,
}: Props) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { flash, errors } = usePage().props;
    const errorMessages = Object.values(errors).map((message) =>
        String(message),
    );

    return (
        <div className="min-h-screen bg-[#F8F9FC] text-[#203452]">
            <div className="flex min-h-screen">
                <AdminSidebar
                    admin={admin}
                    activePage={activePage}
                    mobileOpen={mobileNavOpen}
                    onClose={() => setMobileNavOpen(false)}
                />
                <main className="min-w-0 flex-1">
                    <div className="mx-auto max-w-[1480px] px-4 pt-5 pb-10 sm:px-7 sm:pt-7 xl:px-10">
                        <DashboardHeader
                            title={title}
                            description={description}
                            generatedAt={generatedAt}
                            onMenuOpen={() => setMobileNavOpen(true)}
                        />
                        {flash.success && (
                            <div
                                role="status"
                                className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800"
                            >
                                <CheckCircle2 size={16} />
                                {flash.success}
                            </div>
                        )}
                        {errorMessages.length > 0 && (
                            <div
                                role="alert"
                                className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                            >
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <ul className="space-y-1">
                                    {errorMessages.map((message, index) => (
                                        <li key={`${message}-${index}`}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

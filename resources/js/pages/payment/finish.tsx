import Navbar from '@/components/navbar';
import { formatPrice } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Clock3,
    CreditCard,
    PackageCheck,
    ShieldQuestion,
} from 'lucide-react';
import { motion } from 'motion/react';

type PaymentResultData = {
    order_id: string | null;
    status:
        | 'success'
        | 'pending'
        | 'failed'
        | 'canceled'
        | 'expired'
        | 'unknown';
    status_label: string;
    amount: number | null;
    payment_method: string | null;
    paid_at: string | null;
    order_url: string | null;
};

type Props = {
    result: PaymentResultData;
};

const statusContent: Record<
    PaymentResultData['status'],
    {
        title: string;
        description: string;
        icon: typeof CheckCircle2;
        iconClass: string;
    }
> = {
    success: {
        title: 'Payment Successful!',
        description:
            'Your payment has been confirmed. Thank you for shopping with AwanMart.',
        icon: CheckCircle2,
        iconClass: 'bg-emerald-50 text-emerald-600',
    },
    pending: {
        title: 'Payment Is Being Processed',
        description:
            'Your transaction is not completed yet. Please complete your payment or wait for confirmation.',
        icon: Clock3,
        iconClass: 'bg-amber-50 text-amber-700',
    },
    failed: {
        title: 'Payment Failed',
        description:
            'This transaction could not be completed. Review your order for available next steps.',
        icon: AlertCircle,
        iconClass: 'bg-red-50 text-red-600',
    },
    canceled: {
        title: 'Payment Cancelled',
        description:
            'This payment was cancelled. You can review your order or continue browsing.',
        icon: AlertCircle,
        iconClass: 'bg-[#F0F3F8] text-[#526B91]',
    },
    expired: {
        title: 'Payment Expired',
        description:
            'The payment period for this transaction has ended. Review your order for its current status.',
        icon: Clock3,
        iconClass: 'bg-[#F0F3F8] text-[#526B91]',
    },
    unknown: {
        title: 'We’re Checking Your Payment',
        description:
            'We could not confirm the transaction right now. No successful payment is assumed; please check the order again shortly.',
        icon: ShieldQuestion,
        iconClass: 'bg-[#F0F3F8] text-[#526B91]',
    },
};

const Finish = ({ result }: Props) => {
    const content = statusContent[result.status];
    const StatusIcon = content.icon;

    return (
        <main className="min-h-screen bg-[#F8F9FC] text-[#203452]">
            <Head title="Payment Result" />
            <Navbar activePage="cart" />

            <div className="mx-auto flex max-w-3xl items-center px-4 py-10 sm:px-6 sm:py-16">
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full rounded-2xl border border-[#E2E6ED] bg-white p-6 text-center shadow-sm sm:p-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`mx-auto flex size-16 items-center justify-center rounded-full ${content.iconClass}`}
                    >
                        <StatusIcon size={32} strokeWidth={1.8} />
                    </motion.div>

                    <h1 className="font-playfair mt-5 text-2xl font-semibold sm:text-3xl">
                        {content.title}
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#667085]">
                        {content.description}
                    </p>

                    <motion.dl
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.18 }}
                        className="mx-auto mt-7 max-w-md space-y-3 rounded-xl border border-[#E2E6ED] bg-[#F8F9FC] p-4 text-left"
                    >
                        {result.order_id && (
                            <ResultRow
                                label="Order reference"
                                value={result.order_id}
                            />
                        )}
                        <ResultRow
                            label="Payment status"
                            value={result.status_label}
                        />
                        {result.amount !== null && (
                            <ResultRow
                                label="Total payment"
                                value={formatPrice(result.amount)}
                            />
                        )}
                        {result.payment_method && (
                            <ResultRow
                                label="Payment method"
                                value={formatPaymentMethod(
                                    result.payment_method,
                                )}
                            />
                        )}
                        {result.paid_at && (
                            <ResultRow
                                label="Payment date"
                                value={formatDate(result.paid_at)}
                            />
                        )}
                    </motion.dl>

                    <div className="mx-auto mt-7 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
                        {result.status === 'success' ? (
                            <>
                                <Link
                                    href="/profile#orders"
                                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-sm font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                >
                                    <PackageCheck size={17} />
                                    View My Orders
                                </Link>
                                <Link
                                    href="/products"
                                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E6ED] px-4 text-sm font-semibold text-[#526B91] transition hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                >
                                    Continue Shopping
                                    <ArrowRight size={17} />
                                </Link>
                            </>
                        ) : (
                            <>
                                {result.order_url && (
                                    <Link
                                        href={result.order_url}
                                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-sm font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                    >
                                        {result.status === 'pending' ? (
                                            <CreditCard size={17} />
                                        ) : (
                                            <PackageCheck size={17} />
                                        )}
                                        {result.status === 'pending'
                                            ? 'View Order Details'
                                            : 'Review Order'}
                                    </Link>
                                )}
                                <Link
                                    href="/products"
                                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E6ED] px-4 text-sm font-semibold text-[#526B91] transition hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                                >
                                    <ArrowLeft size={17} />
                                    Continue Shopping
                                </Link>
                            </>
                        )}
                    </div>
                </motion.section>
            </div>
        </main>
    );
};

const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
        <dt className="text-[#667085]">{label}</dt>
        <dd className="font-semibold break-all text-[#203452]">{value}</dd>
    </div>
);

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));

const formatPaymentMethod = (value: string) =>
    value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default Finish;

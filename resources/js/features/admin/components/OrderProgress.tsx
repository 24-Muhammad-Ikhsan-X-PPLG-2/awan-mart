import { Check, Circle, X } from 'lucide-react';
import type { OrderStatusValue } from '../types';

const progressSteps: Array<{
    value: OrderStatusValue;
    label: string;
}> = [
    { value: 'pending_payment', label: 'Menunggu pembayaran' },
    { value: 'processing', label: 'Diproses' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
];

const OrderProgress = ({ status }: { status: OrderStatusValue }) => {
    if (status === 'canceled') {
        return (
            <div className="flex items-center gap-3 rounded-lg bg-[#F3EFF0] px-4 py-3 text-sm font-medium text-[#816A70]">
                <X size={17} />
                Pesanan ini telah dibatalkan.
            </div>
        );
    }

    const currentIndex = progressSteps.findIndex(
        (step) => step.value === status,
    );

    return (
        <ol
            aria-label="Progres pesanan"
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
            {progressSteps.map((step, index) => {
                const complete = index < currentIndex;
                const current = index === currentIndex;

                return (
                    <li
                        key={step.value}
                        className="relative flex items-center gap-2"
                    >
                        <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                                complete || current
                                    ? 'bg-[#203452] text-white'
                                    : 'bg-[#F0F2F5] text-[#A0A9B6]'
                            }`}
                        >
                            {complete ? (
                                <Check size={14} />
                            ) : current ? (
                                <span className="size-2 rounded-full bg-white" />
                            ) : (
                                <Circle size={13} />
                            )}
                        </span>
                        <span
                            className={`text-[10px] leading-4 ${
                                current
                                    ? 'font-semibold text-[#203452]'
                                    : complete
                                      ? 'text-[#526B91]'
                                      : 'text-[#98A2B3]'
                            }`}
                        >
                            {step.label}
                        </span>
                        {index < progressSteps.length - 1 && (
                            <span
                                aria-hidden="true"
                                className={`absolute top-3.5 left-8 hidden h-px w-[calc(100%-1rem)] sm:block ${
                                    complete ? 'bg-[#526B91]' : 'bg-[#E5E8EE]'
                                }`}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
};

export default OrderProgress;

import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

const PaymentMethod = () => {
    return (
        <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#F0F3F8] p-2.5 text-[#203452]">
                    <CreditCard size={19} />
                </div>
                <div>
                    <h2 className="font-semibold text-[#203452]">
                        Metode Pembayaran
                    </h2>
                    <p className="mt-0.5 text-xs text-[#98A2B3]">
                        Pembayaran aman melalui Midtrans
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border-2 border-[#203452] bg-[#F8F9FC] p-4">
                <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <span className="text-lg font-black italic tracking-tight text-[#203452]">
                        mid
                        <span className="text-[#526B91]">trans</span>
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#203452]">
                            Midtrans Payment
                        </p>
                    </div>
                    <p className="mt-1 text-xs text-[#98A2B3]">
                        Transfer bank, e-wallet, QRIS, dan lainnya.
                    </p>
                </div>

                <CheckCircle2 size={21} className="shrink-0 text-[#203452]" />
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#98A2B3]">
                <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-[#526B91]"
                />
                <p>
                    Transaksi diproses melalui sistem pembayaran Midtrans yang
                    aman.
                </p>
            </div>
        </section>
    );
};

export default PaymentMethod;

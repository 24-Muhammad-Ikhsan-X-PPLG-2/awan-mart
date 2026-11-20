import Navbar from "@/components/navbar";
import Footer from "@/features/Home/components/Footer";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowRight,
    CreditCard,
    PackageCheck,
    ShoppingBag,
} from "lucide-react";

const questions = [
    {
        question: "Bagaimana cara membuat pesanan?",
        answer: "Pilih produk yang Anda inginkan, tambahkan ke keranjang, lalu lanjutkan ke checkout. Anda perlu masuk ke akun untuk melihat keranjang dan menyelesaikan pesanan.",
    },
    {
        question: "Metode pembayaran apa saja yang tersedia?",
        answer: "Pembayaran diproses melalui Midtrans. Pilihan yang tersedia dapat mencakup transfer bank, e-wallet, QRIS, dan metode lain yang ditampilkan saat checkout.",
    },
    {
        question: "Bagaimana cara mengetahui ongkos kirim?",
        answer: "Pilih kurir yang tersedia saat checkout. Ongkos kirim untuk setiap pilihan akan ditampilkan sebelum Anda membuat pesanan.",
    },
    {
        question: "Di mana saya bisa melihat status pesanan?",
        answer: "Masuk ke akun lalu buka halaman profil untuk melihat riwayat pesanan dan informasi yang tersedia untuk pesanan Anda.",
    },
    {
        question:
            "Pembayaran saya belum terkonfirmasi. Apa yang harus dilakukan?",
        answer: "Pastikan Anda menyelesaikan instruksi pembayaran dari halaman Midtrans. Setelah itu, periksa kembali status pesanan di akun Anda.",
    },
];

const Help = () => {
    const {
        auth: { user },
    } = usePage().props;
    return (
        <main className="min-h-screen bg-white text-[#203452]">
            <Head title="Pusat Bantuan" />
            <Navbar activePage="Bantuan" />

            <section className="relative isolate overflow-hidden bg-[#F8F9FC]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#203452_0.7px,transparent_0.7px)] bg-size-[18px_18px] opacity-[0.08]"
                />
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:px-10 lg:py-24">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-xs font-bold tracking-[0.24em] text-[#526B91]">
                            <span className="h-px w-8 bg-[#526B91]" />
                            PUSAT BANTUAN
                        </p>
                        <h1 className="font-playfair mt-5 text-4xl leading-[1.12] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            Ada yang bisa kami bantu?
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                            Temukan jawaban seputar cara berbelanja, pembayaran,
                            pengiriman, dan status pesanan di AwanMart.
                        </p>
                        <a
                            href="#faq"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#203452] transition-colors hover:text-[#526B91]"
                        >
                            Lihat pertanyaan umum
                            <ArrowDown size={17} />
                        </a>
                    </div>

                    <div
                        aria-hidden="true"
                        className="hidden size-44 items-center justify-center rounded-full border border-[#203452]/10 bg-white/70 text-[#203452] lg:flex"
                    >
                        <div className="flex size-32 items-center justify-center rounded-full bg-[#203452] text-white shadow-[0_20px_50px_rgba(32,52,82,0.18)]">
                            <ShoppingBag size={42} strokeWidth={1.3} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-10">
                <div className="grid gap-4 sm:grid-cols-3">
                    <a
                        href="#faq"
                        className="group flex items-center gap-4 rounded-2xl border border-[#E8EBF0] p-5 transition-colors hover:border-[#203452]/30 hover:bg-[#F8F9FC]"
                    >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                            <ShoppingBag size={20} />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold">
                                Belanja & akun
                            </span>
                            <span className="mt-1 block text-xs text-[#667085]">
                                Mulai membuat pesanan
                            </span>
                        </span>
                        <ArrowRight
                            size={16}
                            className="ml-auto text-[#98A2B3] transition-transform group-hover:translate-x-1"
                        />
                    </a>
                    <a
                        href="#pembayaran"
                        className="group flex items-center gap-4 rounded-2xl border border-[#E8EBF0] p-5 transition-colors hover:border-[#203452]/30 hover:bg-[#F8F9FC]"
                    >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                            <CreditCard size={20} />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold">
                                Pembayaran
                            </span>
                            <span className="mt-1 block text-xs text-[#667085]">
                                Pilihan dan konfirmasi
                            </span>
                        </span>
                        <ArrowRight
                            size={16}
                            className="ml-auto text-[#98A2B3] transition-transform group-hover:translate-x-1"
                        />
                    </a>
                    <a
                        href="#pengiriman"
                        className="group flex items-center gap-4 rounded-2xl border border-[#E8EBF0] p-5 transition-colors hover:border-[#203452]/30 hover:bg-[#F8F9FC]"
                    >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                            <PackageCheck size={20} />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold">
                                Pengiriman
                            </span>
                            <span className="mt-1 block text-xs text-[#667085]">
                                Kurir dan status pesanan
                            </span>
                        </span>
                        <ArrowRight
                            size={16}
                            className="ml-auto text-[#98A2B3] transition-transform group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </section>

            <section
                id="faq"
                className="scroll-mt-24 bg-[#F8F9FC] px-6 py-16 sm:px-8 sm:py-20 lg:px-10"
            >
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <p className="text-xs font-bold tracking-[0.2em] text-[#526B91]">
                            JAWABAN CEPAT
                        </p>
                        <h2 className="font-playfair mt-3 text-3xl font-semibold sm:text-4xl">
                            Pertanyaan yang sering diajukan
                        </h2>
                    </div>

                    <div className="divide-y divide-[#E2E6ED] border-y border-[#E2E6ED]">
                        {questions.map(({ question, answer }) => (
                            <details
                                key={question}
                                className="group py-5 open:[&>summary>svg]:rotate-180"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-semibold marker:hidden sm:text-base [&::-webkit-details-marker]:hidden">
                                    {question}
                                    <ArrowDown
                                        size={18}
                                        className="shrink-0 text-[#667085] transition-transform"
                                    />
                                </summary>
                                <p className="max-w-2xl pt-3 pr-8 text-sm leading-7 text-[#667085]">
                                    {answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-6 py-14 sm:px-8 sm:py-16 md:grid-cols-2 lg:px-10">
                <article
                    id="pembayaran"
                    className="scroll-mt-24 rounded-2xl border border-[#E8EBF0] p-6 sm:p-8"
                >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                        <CreditCard size={20} />
                    </span>
                    <h2 className="mt-5 text-lg font-semibold">Pembayaran</h2>
                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                        Pembayaran dilakukan melalui Midtrans. Metode yang
                        tersedia akan ditampilkan saat checkout dan dapat
                        mencakup transfer bank, e-wallet, QRIS, serta pilihan
                        lainnya.
                    </p>
                </article>
                <article
                    id="pengiriman"
                    className="scroll-mt-24 rounded-2xl border border-[#E8EBF0] p-6 sm:p-8"
                >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                        <PackageCheck size={20} />
                    </span>
                    <h2 className="mt-5 text-lg font-semibold">Pengiriman</h2>
                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                        Pilihan kurir dan ongkos kirim yang tersedia bisa
                        dilihat saat checkout. Pastikan alamat pengiriman sudah
                        benar sebelum membuat pesanan.
                    </p>
                </article>
            </section>
            {user ? (
                <section
                    id="kontak"
                    className="scroll-mt-24 mx-auto mb-16 max-w-7xl px-6 sm:px-8 lg:px-10"
                >
                    <div className="flex flex-col gap-5 rounded-2xl bg-[#203452] p-7 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-xl">
                            <p className="font-playfair text-2xl font-semibold sm:text-3xl">
                                Perlu melihat pesanan Anda?
                            </p>
                            <p className="mt-2 text-sm leading-7 text-white/65">
                                Masuk ke profile akun untuk memeriksa riwayat
                                pesanan dan informasi status yang tersedia.
                            </p>
                        </div>
                        <Link
                            href="/profile#orders"
                            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#203452] transition-colors hover:bg-[#F0F3F8]"
                        >
                            Masuk ke profile
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            ) : (
                <section
                    id="kontak"
                    className="scroll-mt-24 mx-auto mb-16 max-w-7xl px-6 sm:px-8 lg:px-10"
                >
                    <div className="flex flex-col gap-5 rounded-2xl bg-[#203452] p-7 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-xl">
                            <p className="font-playfair text-2xl font-semibold sm:text-3xl">
                                Perlu melihat pesanan Anda?
                            </p>
                            <p className="mt-2 text-sm leading-7 text-white/65">
                                Masuk ke akun untuk memeriksa riwayat pesanan
                                dan informasi status yang tersedia.
                            </p>
                        </div>
                        <Link
                            href="/auth/login"
                            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#203452] transition-colors hover:bg-[#F0F3F8]"
                        >
                            Masuk ke akun
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
};

export default Help;

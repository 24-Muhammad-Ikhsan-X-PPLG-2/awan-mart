import Navbar from '@/components/navbar';
import Footer from '@/features/Home/components/Footer';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Heart,
    Lightbulb,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';

const values = [
    {
        icon: Lightbulb,
        title: 'Pilihan yang relevan',
        description:
            'Temukan berbagai perangkat elektronik untuk mendukung kerja, belajar, dan hiburan sehari-hari.',
    },
    {
        icon: ShieldCheck,
        title: 'Belanja dengan tenang',
        description:
            'Informasi produk, harga, dan ongkos kirim ditampilkan agar Anda bisa memilih dengan lebih yakin.',
    },
    {
        icon: Heart,
        title: 'Mudah untuk semua',
        description:
            'Kami ingin pengalaman mencari produk hingga menyelesaikan pesanan terasa sederhana dan nyaman.',
    },
];

const About = () => (
    <main className="min-h-screen bg-white text-[#203452]">
        <Head title="Tentang Kami" />
        <Navbar activePage="Tentang Kami" />

        <section className="relative isolate overflow-hidden bg-[#F8F9FC]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#203452_0.7px,transparent_0.7px)] bg-size-[18px_18px] opacity-[0.08]"
            />
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-18 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-28">
                <div>
                    <p className="flex items-center gap-3 text-xs font-bold tracking-[0.24em] text-[#526B91]">
                        <span className="h-px w-8 bg-[#526B91]" />
                        MENGENAL AWANMART
                    </p>
                    <h1 className="font-playfair mt-5 max-w-2xl text-4xl leading-[1.12] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        Teknologi yang terasa lebih dekat.
                    </h1>
                    <p className="mt-6 max-w-xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                        AwanMart hadir untuk membantu Anda menemukan perangkat
                        elektronik yang sesuai kebutuhan—dengan pengalaman
                        belanja yang praktis, jelas, dan nyaman.
                    </p>
                    <Link
                        href="/products"
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#203452] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2D466A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#526B91]"
                    >
                        Jelajahi produk
                        <ArrowRight size={17} />
                    </Link>
                </div>

                <div className="relative mx-auto flex min-h-72 w-full max-w-md items-center justify-center sm:min-h-96">
                    <div className="absolute size-64 rounded-full border border-[#203452]/10 sm:size-80" />
                    <div className="absolute size-48 rounded-full border border-[#203452]/10 sm:size-64" />
                    <div className="relative flex size-36 flex-col items-center justify-center rounded-full bg-[#203452] text-white shadow-[0_24px_70px_rgba(32,52,82,0.2)] sm:size-44">
                        <Sparkles size={30} strokeWidth={1.4} />
                        <span className="font-playfair mt-3 text-xl font-semibold sm:text-2xl">
                            AwanMart
                        </span>
                    </div>
                    <div className="absolute top-8 right-1 flex items-center gap-2 rounded-full border border-[#E8EBF0] bg-white px-4 py-2.5 text-xs font-medium text-[#526B91] shadow-sm sm:right-0">
                        <Check size={15} />
                        Belanja lebih mudah
                    </div>
                    <div className="absolute bottom-8 left-0 rounded-2xl border border-[#E8EBF0] bg-white p-4 shadow-[0_12px_35px_rgba(32,52,82,0.08)] sm:left-2">
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#98A2B3]">
                            PILIHAN UNTUK
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                            Aktivitas sehari-hari
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-[#526B91]">
                        CERITA KAMI
                    </p>
                    <h2 className="font-playfair mt-4 text-3xl leading-tight font-semibold sm:text-4xl">
                        Memilih teknologi seharusnya tidak rumit.
                    </h2>
                </div>
                <div className="space-y-5 text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                    <p>
                        Kebutuhan teknologi setiap orang berbeda. Ada yang
                        mencari perangkat untuk bekerja, belajar, berkarya,
                        atau menikmati waktu luang. AwanMart menyediakan ruang
                        untuk menjelajahi berbagai pilihan dalam satu tempat.
                    </p>
                    <p>
                        Kami terus berupaya menyajikan pengalaman yang mudah
                        dipahami dari melihat detail produk, memilih kurir,
                        hingga menyelesaikan pembayaran. Tujuan kami sederhana:
                        membantu Anda berbelanja dengan lebih percaya diri.
                    </p>
                </div>
            </div>
        </section>

        <section className="bg-[#F8F9FC]">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#526B91]">
                        YANG KAMI UTAMAKAN
                    </p>
                    <h2 className="font-playfair mt-4 text-3xl font-semibold sm:text-4xl">
                        Belanja yang berangkat dari kebutuhan Anda.
                    </h2>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {values.map(({ icon: Icon, title, description }, index) => (
                        <article
                            key={title}
                            className="rounded-2xl border border-[#E8EBF0] bg-white p-6 sm:p-8"
                        >
                            <span className="flex size-12 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                                <Icon size={22} strokeWidth={1.7} />
                            </span>
                            <p className="mt-7 text-xs font-semibold tracking-[0.16em] text-[#98A2B3]">
                                0{index + 1}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold">
                                {title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-[#667085]">
                                {description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-14 sm:px-8 sm:py-16 md:flex-row md:items-center md:justify-between lg:px-10">
            <div>
                <p className="font-playfair text-2xl font-semibold sm:text-3xl">
                    Siap menemukan perangkat berikutnya?
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Jelajahi koleksi dan temukan yang paling sesuai untuk Anda.
                </p>
            </div>
            <Link
                href="/products"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#203452]/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#203452] hover:bg-[#F8F9FC]"
            >
                Lihat katalog
                <ArrowRight size={16} />
            </Link>
        </section>

        <Footer />
    </main>
);

export default About;

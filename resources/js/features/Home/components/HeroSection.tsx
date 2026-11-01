import { appName } from "@/constant";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative isolate overflow-hidden bg-[#F8F9FC] text-[#203452]">
            {/* Dekorasi biar ga kosong amat */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#203452]/[0.035] blur-3xl" />
                <div className="absolute -right-32 -top-40 h-125 w-125 rounded-full border border-[#203452]/6" />
                <div className="absolute -right-16 -top-24 h-95 w-95 rounded-full border border-[#203452]/6" />
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.12] bg-[radial-gradient(#203452_0.7px,transparent_0.7px)] bg-size-[18px_18px]" />
            </div>

            <div className="mx-auto grid min-h-145 max-w-7xl grid-cols-1 items-center gap-8 px-6 py-12 sm:px-8 lg:grid-cols-2 lg:gap-4 lg:px-12 lg:py-16">
                <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
                    {/* Tagline atas */}
                    <div className="mb-2 flex items-center gap-3">
                        <span className="h-px w-8 bg-[#526B91]" />
                        <span className="text-xs font-bold tracking-[0.25em] text-[#526B91] sm:text-sm">
                            BELANJA LEBIH MUDAH
                        </span>
                    </div>
                    {/* Slogan */}
                    <h1 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
                        Teknologi untuk Kehidupan Modern.
                    </h1>
                    {/* Deskripsi */}
                    <p className="mt-5 max-w-md text-sm leading-7 text-[#667085] sm:text-base">
                        Temukan berbagai perangkat elektronik berkualitas dengan
                        harga terbaik hanya di {appName}.
                    </p>
                    {/* CTA */}
                    <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row lg:items-start">
                        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#203452] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2D466A] hover:shadow-xl active:scale-[0.98] sm:w-auto cursor-pointer">
                            Belanja Sekarang
                            <ArrowRight size={18} />
                        </button>

                        <button className="w-full rounded-lg border border-[#203452]/25 bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#203452] transition-all duration-300 hover:border-[#203452] hover:bg-white active:scale-[0.98] sm:w-auto cursor-pointer">
                            Lihat Katalog
                        </button>
                    </div>
                    <div className="mt-8 flex items-center gap-3">
                        {/* Dekorasi biar tambah keren */}
                        <div className="flex -space-x-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#203452]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#203452]/40" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#203452]/20" />
                        </div>
                        <p className="text-xs tracking-wide text-gray-500">
                            Temukan teknologi yang mendukung aktivitas Anda.
                        </p>
                    </div>
                </div>

                <div className="relative flex w-full items-center justify-center lg:justify-end">
                    {/* Dekorasi ajah */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#203452]/10 blur-[90px] sm:h-96 sm:w-96" />

                    <div className="pointer-events-none absolute right-[12%] top-[8%] h-20 w-20 rounded-full border border-[#203452]/10" />
                    <div className="pointer-events-none absolute bottom-[12%] left-[8%] h-12 w-12 rounded-full border border-[#203452]/15" />
                    {/* Biar keliatan wah */}
                    <div className="pointer-events-none absolute z-20 right-[16%] top-[18%] flex items-center gap-2 rounded-full border border-[#203452]/10 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold tracking-wider text-[#526B91]">
                            PREMIUM TECHNOLOGY
                        </span>
                    </div>

                    <div className="pointer-events-none absolute bottom-[15%] right-[10%] h-2 w-2 rounded-full bg-[#203452]/40 shadow-[0_0_0_6px_rgba(32,52,82,0.06)]" />

                    <img
                        src="/image/hero-banner.png"
                        alt="Koleksi perangkat elektronik AwanMart"
                        className="relative z-10 h-auto w-full max-w-140 object-contain drop-shadow-xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

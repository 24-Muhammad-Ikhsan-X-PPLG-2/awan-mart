import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { appName } from '@/constant';

const CTASection = () => {
    return (
        <section
            id="CTA"
            className="mx-auto mt-12 w-full max-w-7xl px-4 sm:mt-16 sm:px-6 lg:px-10"
        >
            <div className="relative isolate overflow-hidden rounded-2xl bg-[#203452] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                {/* Dekorasi simple */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full border border-white/10" />
                    <div className="absolute -top-20 -right-10 h-60 w-60 rounded-full border border-white/10" />
                    <div className="absolute right-[20%] -bottom-32 h-64 w-64 rounded-full bg-white/4 blur-3xl" />
                </div>

                <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                    {/* Konten utamanya */}
                    <div className="max-w-2xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                            <Sparkles size={14} />
                            <span className="text-xs font-semibold tracking-wider">
                                PENAWARAN SPESIAL
                            </span>
                        </div>

                        <h2 className="font-playfair text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                            Teknologi Pilihan,
                            <br />
                            <span className="text-[#B8C8DF]">
                                Harga Lebih Bersahabat.
                            </span>
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
                            Temukan berbagai penawaran menarik untuk produk
                            elektronik pilihan hanya di {appName}.
                        </p>

                        <Link
                            href="/products"
                            className="group mt-7 inline-flex w-fit items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#203452] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F1F3F7] hover:shadow-lg active:scale-[0.98]"
                        >
                            Jelajahi Produk
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                    {/* Dekorasi Promo */}
                    <div className="hidden shrink-0 items-center justify-center pr-6 sm:flex lg:pr-12">
                        <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/6 lg:h-48 lg:w-48">
                            <div className="absolute inset-3 rounded-full border border-dashed border-white/20" />

                            <div className="flex flex-col items-center">
                                <Tag
                                    size={38}
                                    strokeWidth={1.3}
                                    className="mb-2 text-[#B8C8DF]"
                                />
                                <span className="text-xs font-semibold tracking-[0.2em] text-white/70">
                                    AWANMART
                                </span>
                                <span className="font-playfair mt-1 text-xl font-bold lg:text-2xl">
                                    Special
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;

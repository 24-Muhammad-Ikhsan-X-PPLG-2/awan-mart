import { SubmitHandler, useForm } from "react-hook-form";
import { formLoginSchema, FormLoginSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, usePage } from "@inertiajs/react";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, MoveRight } from "lucide-react";
import InputComponent from "@/components/InputComponent";
import { useState } from "react";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<FormLoginSchemaType>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { flash } = usePage().props;
    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const login: SubmitHandler<FormLoginSchemaType> = ({ email, password }) => {
        router.post(
            "/auth/login",
            { email, password },
            {
                preserveScroll: true,
                preserveState: true,
                onBefore: () => setIsLoading(true),
                onError: (e) => {
                    Object.entries(e).forEach(([field, message]) => {
                        setError(field as keyof FormLoginSchemaType, {
                            message,
                        });
                    });
                },
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <main className="min-h-dvh flex flex-col lg:flex-row">
            <section className="relative overflow-hidden bg-[#203452] text-white px-6 py-8 sm:px-10 sm:py-10 lg:w-[40%] lg:min-h-dvh lg:px-12 lg:py-12 lg:flex lg:flex-col lg:justify-between hidden md:block">
                <div className="pointer-events-none absolute size-64 rounded-full border-2 border-gray-400/30 -top-36 -right-32 lg:size-80" />
                <div className="pointer-events-none absolute size-64 rounded-full border-2 border-gray-400/30 -bottom-36 -left-32 lg:size-80" />

                <div className="relative z-10">
                    <h1 className="font-playfair text-2xl sm:text-3xl font-semibold">
                        AwanMart
                    </h1>

                    <p className="mt-1 text-[10px] sm:text-sm tracking-[0.2em] text-gray-300 font-medium">
                        ELECTRONICS & TECHNOLOGY
                    </p>

                    <div className="mt-8 mb-6 h-1 w-16 bg-gray-300 sm:mt-10 lg:mt-15 lg:mb-10 lg:w-24" />

                    <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl max-w-xl leading-tight">
                        Teknologi untuk Kebutuhan Anda.
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed">
                        Temukan berbagai perangkat elektronik berkualitas untuk
                        mendukung produktivitas, kreativitas, dan kebutuhan
                        sehari-hari.
                    </p>
                </div>

                <p className="relative z-10 hidden lg:block text-xs font-light text-gray-300 tracking-wider">
                    E-COMMERCE • ELECTRONICS & TECHNOLOGY • 2026
                </p>
            </section>

            <section className="flex-1 min-h-[65dvh] flex items-center justify-center px-6 py-12 sm:px-10 lg:min-h-dvh lg:px-12 xl:px-20">
                <div className="w-full max-w-md xl:max-w-lg text-[#203452]">
                    <p className="text-xs sm:text-sm tracking-[0.2em] font-medium">
                        SELAMAT DATANG KEMBALI
                    </p>

                    <h1 className="font-playfair text-3xl sm:text-4xl mt-3 font-bold leading-tight">
                        Masuk Ke Akun Anda
                    </h1>

                    <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
                        Silakan login untuk melanjutkan menggunakan aplikasi
                        AwanMart.
                    </p>

                    {flash.success && (
                        <div
                            role="status"
                            className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                        >
                            <CheckCircle2
                                size={20}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{flash.success}</p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(login)}
                        className="mt-8 flex flex-col gap-5"
                    >
                        <InputComponent
                            label="Email"
                            type="email"
                            disabled={isLoading}
                            placeholder="Masukkan email Anda"
                            Icon={<Mail size={20} />}
                            error={errors.email?.message}
                            {...register("email", {
                                onChange: () => clearErrors("email"),
                            })}
                        />

                        <InputComponent
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            placeholder="Masukkan password Anda"
                            Icon={<Lock size={20} />}
                            error={errors.password?.message}
                            {...register("password", {
                                onChange: () => clearErrors("password"),
                            })}
                            buttonRight={
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            }
                        />

                        <a
                            href="#"
                            className="self-end w-fit hover:underline text-blue-600 text-sm"
                        >
                            Lupa Password?
                        </a>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 w-full justify-center py-3.5 text-white bg-[#203452] hover:bg-[#2c4568] active:scale-[0.99] transition-all font-semibold rounded-lg cursor-pointer disabled:bg-[#2f425e]"
                        >
                            {isLoading ? (
                                <div className="loader w-6"></div>
                            ) : (
                                <>
                                    Masuk
                                    <MoveRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-5 mx-auto w-fit">
                        Belum punya akun?{" "}
                        <Link
                            href={"/auth/register"}
                            className="text-blue-600 hover:underline"
                        >
                            Daftar
                        </Link>
                    </p>

                    <p className="mt-10 text-center text-xs tracking-wide lg:hidden">
                        E-COMMERCE • ELECTRONICS & TECHNOLOGY • 2026
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;

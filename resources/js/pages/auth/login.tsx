import { SubmitHandler, useForm } from 'react-hook-form';
import { formLoginSchema, FormLoginSchemaType } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, MoveRight } from 'lucide-react';
import InputComponent from '@/components/InputComponent';
import { useState } from 'react';

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
            email: '',
            password: '',
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { flash } = usePage().props;
    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const login: SubmitHandler<FormLoginSchemaType> = ({ email, password }) => {
        router.post(
            '/auth/login',
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
        <main className="flex min-h-dvh flex-col lg:flex-row">
            <section className="relative hidden overflow-hidden bg-[#203452] px-6 py-8 text-white sm:px-10 sm:py-10 md:block lg:flex lg:min-h-dvh lg:w-[40%] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
                <div className="pointer-events-none absolute -top-36 -right-32 size-64 rounded-full border-2 border-gray-400/30 lg:size-80" />
                <div className="pointer-events-none absolute -bottom-36 -left-32 size-64 rounded-full border-2 border-gray-400/30 lg:size-80" />

                <div className="relative z-10">
                    <h1 className="font-playfair text-2xl font-semibold sm:text-3xl">
                        AwanMart
                    </h1>

                    <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-gray-300 sm:text-sm">
                        ELECTRONICS & TECHNOLOGY
                    </p>

                    <div className="mt-8 mb-6 h-1 w-16 bg-gray-300 sm:mt-10 lg:mt-15 lg:mb-10 lg:w-24" />

                    <h2 className="font-playfair max-w-xl text-2xl leading-tight sm:text-3xl lg:text-4xl">
                        Teknologi untuk Kebutuhan Anda.
                    </h2>

                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base">
                        Temukan berbagai perangkat elektronik berkualitas untuk
                        mendukung produktivitas, kreativitas, dan kebutuhan
                        sehari-hari.
                    </p>
                </div>

                <p className="relative z-10 hidden text-xs font-light tracking-wider text-gray-300 lg:block">
                    E-COMMERCE • ELECTRONICS & TECHNOLOGY • 2026
                </p>
            </section>

            <section className="flex min-h-[65dvh] flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:min-h-dvh lg:px-12 xl:px-20">
                <div className="w-full max-w-md text-[#203452] xl:max-w-lg">
                    <p className="text-xs font-medium tracking-[0.2em] sm:text-sm">
                        SELAMAT DATANG KEMBALI
                    </p>

                    <h1 className="font-playfair mt-3 text-3xl leading-tight font-bold sm:text-4xl">
                        Masuk Ke Akun Anda
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
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
                            {...register('email', {
                                onChange: () => clearErrors('email'),
                            })}
                        />

                        <InputComponent
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            disabled={isLoading}
                            placeholder="Masukkan password Anda"
                            Icon={<Lock size={20} />}
                            error={errors.password?.message}
                            {...register('password', {
                                onChange: () => clearErrors('password'),
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
                            className="w-fit self-end text-sm text-blue-600 hover:underline"
                        >
                            Lupa Password?
                        </a>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#203452] py-3.5 font-semibold text-white transition-all hover:bg-[#2c4568] active:scale-[0.99] disabled:bg-[#2f425e]"
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

                    <p className="mx-auto mt-5 w-fit">
                        Belum punya akun?{' '}
                        <Link
                            href={'/auth/register'}
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

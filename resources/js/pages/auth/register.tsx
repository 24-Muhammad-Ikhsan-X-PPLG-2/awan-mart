import { SubmitHandler, useForm } from 'react-hook-form';
import { formRegisterSchema, FormRegisterSchemaType } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, MoveRight, User } from 'lucide-react';
import InputComponent from '@/components/InputComponent';
import { useState } from 'react';

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<FormRegisterSchemaType>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowPasswordConfirm = () =>
        setShowPasswordConfirm((prev) => !prev);
    const login: SubmitHandler<FormRegisterSchemaType> = ({
        email,
        password,
        confirmPassword,
        name,
    }) => {
        router.post(
            '/auth/register',
            { email, password, name, confirmPassword },
            {
                preserveScroll: true,
                preserveState: true,
                onBefore: () => setIsLoading(true),
                onError: (e) => {
                    Object.entries(e).forEach(([field, message]) => {
                        setError(field as keyof FormRegisterSchemaType, {
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
                        BERGABUNG DENGAN KAMI
                    </p>

                    <h1 className="font-playfair mt-3 text-3xl leading-tight font-bold sm:text-4xl">
                        Daftar Akun Baru
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                        Daftar akun untuk pengalaman berbelanja yang lebih baik
                        di AwanMart.
                    </p>

                    <form
                        onSubmit={handleSubmit(login)}
                        className="mt-8 flex flex-col gap-5"
                    >
                        <InputComponent
                            label="Nama Lengkap"
                            type="text"
                            disabled={isLoading}
                            placeholder="Masukkan nama lengkap Anda"
                            Icon={<User size={20} />}
                            error={errors.name?.message}
                            {...register('name', {
                                onChange: () => clearErrors('name'),
                            })}
                        />
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
                            disabled={isLoading}
                            type={showPassword ? 'text' : 'password'}
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
                        <InputComponent
                            label="Konfirmasi Password"
                            disabled={isLoading}
                            type={showPasswordConfirm ? 'text' : 'password'}
                            placeholder="Konfirmasi password Anda"
                            Icon={<Lock size={20} />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword', {
                                onChange: () => clearErrors('confirmPassword'),
                            })}
                            buttonRight={
                                <button
                                    type="button"
                                    onClick={toggleShowPasswordConfirm}
                                >
                                    {showPasswordConfirm ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            }
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#203452] py-3.5 font-semibold text-white transition-all hover:bg-[#2c4568] active:scale-[0.99] disabled:bg-[#2f425e]"
                        >
                            {isLoading ? (
                                <div className="loader w-6"></div>
                            ) : (
                                <>
                                    Daftar Akun
                                    <MoveRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mx-auto mt-5 w-fit">
                        Sudah punya akun?{' '}
                        <Link
                            href={'/auth/login'}
                            className="text-blue-600 hover:underline"
                        >
                            Masuk
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

export default Register;

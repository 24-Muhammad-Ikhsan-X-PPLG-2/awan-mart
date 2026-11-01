import { SubmitHandler, useForm } from "react-hook-form";
import { formRegisterSchema, FormRegisterSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "@inertiajs/react";
import { Eye, EyeOff, Lock, Mail, MoveRight, User } from "lucide-react";
import InputComponent from "@/components/InputComponent";
import { useState } from "react";

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
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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
            "/auth/register",
            { email, password, name, confirmPassword },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (e) => {
                    Object.entries(e).forEach(([field, message]) => {
                        setError(field as keyof FormRegisterSchemaType, {
                            message,
                        });
                    });
                },
            },
        );
    };

    return (
        <main className="min-h-dvh flex flex-col lg:flex-row">
            {/* Branding */}
            <section className="relative overflow-hidden bg-[#203452] text-white px-6 py-8 sm:px-10 sm:py-10 lg:w-[40%] lg:min-h-dvh lg:px-12 lg:py-12 lg:flex lg:flex-col lg:justify-between hidden md:block">
                {/* Decorative circles */}
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

            {/* Login form */}
            <section className="flex-1 min-h-[65dvh] flex items-center justify-center px-6 py-12 sm:px-10 lg:min-h-dvh lg:px-12 xl:px-20">
                <div className="w-full max-w-md xl:max-w-lg text-[#203452]">
                    <p className="text-xs sm:text-sm tracking-[0.2em] font-medium">
                        BERGABUNG DENGAN KAMI
                    </p>

                    <h1 className="font-playfair text-3xl sm:text-4xl mt-3 font-bold leading-tight">
                        Daftar Akun Baru
                    </h1>

                    <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
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
                            placeholder="Masukkan nama lengkap Anda"
                            Icon={<User size={20} />}
                            error={errors.name?.message}
                            {...register("name", {
                                onChange: () => clearErrors("name"),
                            })}
                        />
                        <InputComponent
                            label="Email"
                            type="email"
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
                        <InputComponent
                            label="Konfirmasi Password"
                            type={showPasswordConfirm ? "text" : "password"}
                            placeholder="Konfirmasi password Anda"
                            Icon={<Lock size={20} />}
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword", {
                                onChange: () => clearErrors("confirmPassword"),
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
                            className="flex items-center gap-2 w-full justify-center py-3.5 text-white bg-[#203452] hover:bg-[#2c4568] active:scale-[0.99] transition-all font-semibold rounded-lg cursor-pointer"
                        >
                            Daftar Akun
                            <MoveRight size={20} />
                        </button>
                    </form>

                    <p className="mt-5 mx-auto w-fit">
                        Sudah punya akun?{" "}
                        <Link
                            href={"/auth/login"}
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

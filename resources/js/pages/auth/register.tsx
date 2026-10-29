import { SubmitHandler, useForm } from "react-hook-form";
import { formRegisterSchema, FormRegisterSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormRegisterSchemaType>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });
    const onSubmit: SubmitHandler<FormRegisterSchemaType> = ({
        email,
        name,
        password,
        confirmPassword,
    }) => {
        router.post(
            "/auth/register",
            {
                email,
                name,
                password,
                confirmPassword,
            },
            {
                onError: (e) => {
                    console.error(e);
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    };
    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                className="flex flex-col gap-2 w-1/2"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className="mx-auto text-3xl font-bold mb-5">Register</h1>
                <div className="flex flex-col">
                    <input
                        type="email"
                        className={`border-2 rounded outline-none px-2 py-1.5 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="Email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="mt-1 text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col">
                    <input
                        type="text"
                        className={`border-2 rounded outline-none px-2 py-1.5 ${errors.name ? "border-red-500" : ""}`}
                        placeholder="Name"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="mt-1 text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col">
                    <input
                        type="password"
                        className={`border-2 rounded outline-none px-2 py-1.5 ${errors.password ? "border-red-500" : ""}`}
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="mt-1 text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col">
                    <input
                        type="password"
                        className={`border-2 rounded outline-none px-2 py-1.5 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <button
                    className="bg-black rounded text-white mt-5 w-full py-2 font-semibold cursor-pointer text-center focus:shadow-[5px_5px_0_grey] transition duration-500"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Register;

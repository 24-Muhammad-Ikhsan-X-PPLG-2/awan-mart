import { SubmitHandler, useForm } from "react-hook-form";
import { formLoginSchema, FormLoginSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormLoginSchemaType>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const login: SubmitHandler<FormLoginSchemaType> = ({ email, password }) => {
        router.post(
            "/auth/login",
            {
                email,
                password,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (e) => {
                    Object.entries(e).forEach(([field, message]) => {
                        setError(field as keyof FormLoginSchemaType, {
                            message,
                        });
                    });
                },
            },
        );
    };
    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                className="flex flex-col gap-2 w-1/2"
                onSubmit={handleSubmit(login)}
            >
                <h1 className="mx-auto text-3xl font-bold mb-5">Login</h1>
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
                <button
                    className="bg-black rounded text-white mt-5 w-full py-2 font-semibold cursor-pointer text-center focus:shadow-[5px_5px_0_black] transition duration-500"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Login;

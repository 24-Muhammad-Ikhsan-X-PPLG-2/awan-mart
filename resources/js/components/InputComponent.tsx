import { ComponentPropsWithRef, ReactNode } from "react";

type InputComponentProps = ComponentPropsWithRef<"input"> & {
    label: string;
    Icon?: ReactNode;
    error?: string;
    buttonRight?: ReactNode;
};

const InputComponent = ({
    label,
    ref,
    Icon,
    error,
    buttonRight,
    ...props
}: InputComponentProps) => {
    const id = label.toLowerCase().replace(" ", "-");

    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className="font-semibold w-fit text-sm sm:text-base"
            >
                {label}
            </label>

            <div
                className={`group flex items-center justify-between border-2 transition-colors mt-2 rounded-lg ${
                    error
                        ? "border-red-500"
                        : "border-gray-400 focus-within:border-[#203452]"
                }`}
            >
                <div className="flex items-center gap-1 w-full">
                    {Icon && (
                        <span
                            className={`transition-colors pl-3 ${
                                error
                                    ? "text-red-500"
                                    : "text-gray-500 group-focus-within:text-[#203452]"
                            }`}
                        >
                            {Icon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={id}
                        className="outline-none w-full min-w-0 bg-transparent text-sm sm:text-base placeholder:text-gray-400 h-full p-3"
                        aria-invalid={!!error}
                        {...props}
                    />
                </div>
                <div className="flex items-center pr-3">{buttonRight}</div>
            </div>

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default InputComponent;

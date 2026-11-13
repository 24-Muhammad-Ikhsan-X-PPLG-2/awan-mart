import { ComponentPropsWithRef, ReactNode } from 'react';

type InputComponentProps = ComponentPropsWithRef<'input'> & {
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
    const id = label.toLowerCase().replace(' ', '-');

    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className="w-fit text-sm font-semibold sm:text-base"
            >
                {label}
            </label>

            <div
                className={`group mt-2 flex min-h-12 items-center justify-between rounded-md border transition-colors focus-within:ring-2 focus-within:ring-[#526B91]/10 ${
                    error
                        ? 'border-red-400 focus-within:border-red-500'
                        : 'border-[#D5DBE4] focus-within:border-[#526B91]'
                }`}
            >
                <div className="flex w-full items-center gap-1">
                    {Icon && (
                        <span
                            className={`pl-3 transition-colors ${
                                error
                                    ? 'text-red-500'
                                    : 'text-[#98A2B3] group-focus-within:text-[#203452]'
                            }`}
                        >
                            {Icon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={id}
                        className="h-full w-full min-w-0 bg-transparent p-3 text-sm text-[#203452] outline-none placeholder:text-[#98A2B3] sm:text-base"
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

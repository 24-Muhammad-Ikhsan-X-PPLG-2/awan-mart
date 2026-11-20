import { FC } from "react";
import { AlertCircle } from "lucide-react";

type Props = {
    errors: Record<string, string>;
};

const ErrorAlert: FC<Props> = ({ errors }) => {
    const messages = Object.values(errors);

    if (messages.length === 0) return null;

    return (
        <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />

            <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-red-700">
                    Terjadi kesalahan
                </h3>

                <ul className="mt-1 space-y-1">
                    {messages.map((message, index) => (
                        <li
                            key={index}
                            className="text-sm leading-relaxed text-red-600"
                        >
                            {message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ErrorAlert;

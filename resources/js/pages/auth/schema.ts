import z from "zod";

export const formLoginSchema = z.object({
    email: z.email(),
    password: z.string(),
});
export const formRegisterSchema = z
    .object({
        email: z.email().nonempty("Email tidak boleh kosong!"),
        name: z.string().min(4, "Nama minimal 4 karakter!"),
        password: z.string().min(8, "Password minimal 8 karakter!"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi password tidak cocok!",
        path: ["confirmPassword"],
    });

export type FormLoginSchemaType = z.infer<typeof formLoginSchema>;
export type FormRegisterSchemaType = z.infer<typeof formRegisterSchema>;

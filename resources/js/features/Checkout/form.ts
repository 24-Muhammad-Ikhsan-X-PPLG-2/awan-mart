import z, { string } from "zod";

export const formAddress = z.object({
    recipient_name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string(),
    postal_code: z.string(),
});

export type TypeFormAddress = z.infer<typeof formAddress>;

import { z } from "zod";

export const UserLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(3, { message: "Password must be at least 6 characters" })
        .trim(),
});



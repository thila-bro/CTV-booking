import { z } from "zod";

export const AdminSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(3, { message: "Password must be at least 3 characters" })
        .trim(),
});
import { z } from "zod";

export const AdminLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(3, { message: "Password must be at least 3 characters" })
        .trim(),
});

export const AdminSaveSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        // .regex(/[A-Za-z]/, { message: "Password must contain at least one letter." })
        // .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
        .trim(),
});
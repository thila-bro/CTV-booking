import { z } from "zod";

export const UserSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters long" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
    mobile: z.string().min(10, { message: "Mobile number must be at least 10 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(3, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(3, { message: "Confirm Password must be at least 6 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
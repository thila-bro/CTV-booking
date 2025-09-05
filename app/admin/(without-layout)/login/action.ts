"use server";

import { createSession, deleteSession } from "@/lib/session";
import { AdminLoginSchema } from "@/models/AdminLogin";
import { findAdminByEmailRepo } from "@/repositories/admin";
import bcrypt from 'bcrypt';
import { redirect, RedirectType } from 'next/navigation';



export async function AdminLogin(prevState: any, formData: FormData) {
    const result = AdminLoginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { email, password } = result.data;
    const admin = await findAdminByEmailRepo(email);

    if (!admin) {
        return { message: "No user found with this email." };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        return { message: "Invalid password." };
    }

    await createSession(admin.id, 'admin');
    redirect('/admin', RedirectType.replace);
}

export async function AdminLogout() {
    await deleteSession("admin");
    return;
}
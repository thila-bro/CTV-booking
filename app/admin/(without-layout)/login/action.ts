"use server";

import { createSession, deleteSession } from "@/lib/session";
import { AdminSchema } from "@/models/Admin";
import { findAdminByEmailRepo } from "@/repositories/admin";
import bcrypt from 'bcrypt';
import { redirect, RedirectType } from 'next/navigation';



export async function AdminLogin(prevState: any, formData: FormData) {
    const result = AdminSchema.safeParse(Object.fromEntries(formData));
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

    await createSession(admin.id);
    redirect('/admin', RedirectType.replace);
}

export async function AdminLogout() {
    await deleteSession();
    return;
}
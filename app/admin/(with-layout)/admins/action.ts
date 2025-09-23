'use server';

import { AdminSaveSchema } from "@/models/Admin";
import { activateAdminRepo, addAdminRepo, deactivateAdminRepo, getAllAdminsRepo, resetAdminPasswordRepo } from "@/repositories/admin";
import bcrypt from 'bcrypt';

export async function addAdmin(prevState: any, formData: FormData) {
    const validationResult = AdminSaveSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!validationResult.success) {
        return { errors: validationResult.error.flatten().fieldErrors, data: Object.fromEntries(formData) };
    }

    const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);

    const admin = await addAdminRepo({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: hashedPassword
    });

    if (admin?.id) {
        return {
            message: "Successfully",
            success: true,
            name: admin.name
        }
    }
}

export async function getAllActiveAdmins() {
    return await getAllAdminsRepo();
}

export async function resetAdminPassword(adminId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const resetPassword = await resetAdminPasswordRepo(adminId, hashedPassword);
    if (resetPassword?.id) {
        return {
            message: "Password reset successfully",
            success: true,
        }
    }
}

export async function deactivateAdmin(adminId: string) {
    const response = await deactivateAdminRepo(adminId);
    if (!response) {
        return {
            message: "Failed to deactivate admin",
            success: false,
        }
    }
}

export async function activateAdmin(adminId: string) {
    const response = await activateAdminRepo(adminId);
    if (!response) {
        return {
            message: "Failed to activate admin",
            success: false,
        }
    }
}
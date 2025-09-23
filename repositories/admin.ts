'use server';

import { sql } from '@/lib/pgsqlConnector';

export async function addAdminRepo(admin: any) {
    const [newAdmin] = await sql`
    INSERT 
    INTO admins (name, email, password) 
    VALUES (${admin.name}, ${admin.email}, ${admin.password}) RETURNING *`;
    return newAdmin;
}

export async function findAdminByEmailRepo(email: string) {
    const [admin] = await sql`SELECT * FROM admins WHERE email = ${email}`;
    return admin;
}

export async function getAllAdminsRepo() {
    const admins = await sql`SELECT * FROM admins WHERE is_superadmin = FALSE ORDER BY created_at DESC`;
    return admins;
}

export async function resetAdminPasswordRepo(adminId: string, hashedPassword: string) {
    const [admin] = await sql`UPDATE admins SET password = ${hashedPassword} WHERE id = ${adminId} RETURNING *`;
    return admin;
}

export async function deactivateAdminRepo(adminId: string) {
    const [admin] = await sql`UPDATE admins SET is_active = FALSE WHERE id = ${adminId} RETURNING *`;
    return admin;
}

export async function activateAdminRepo(adminId: string) {
    const [admin] = await sql`UPDATE admins SET is_active = TRUE WHERE id = ${adminId} RETURNING *`;
    return admin;
}
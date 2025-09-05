'use server';

import { sql } from '@/lib/pgsqlConnector';

export async function findAdminByEmailRepo(email: string) {
    const [admin] = await sql`SELECT * FROM admins WHERE email = ${email}`;
    return admin;
}
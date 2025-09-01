'use server'
import { sql } from '@/lib/pgsqlConnector';

export async function addSpaceRepo(Space: any) {
    // const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
    const [insertSpace] = await sql`
        INSERT INTO spaces (id, name, price)
        VALUES (${crypto.randomUUID()}, ${Space.name}, ${parseInt(Space.price)})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Space added successfully', db: insertSpace };
}

export async function getAllSpaces() {
    // const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
    const spaces = await sql`SELECT * FROM spaces ORDER BY id DESC`;
    return spaces;
}
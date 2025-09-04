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

export async function getAllSpacesRepo() {
    // const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
    const spaces = await sql`SELECT * FROM spaces ORDER BY id DESC`;
    return spaces;
}

export async function deleteSpaceRepo(spaceId: string) {
    // const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
    await sql`DELETE FROM space_images WHERE space_id = ${spaceId} `;
    await sql`DELETE FROM spaces WHERE id = ${spaceId} `;
    return { success: true };
}

export async function updateSpaceRepo(Space: any) {
    await sql `UPDATE spaces SET name=${Space.name}, price=${Space.price} WHERE id=${Space.id}`;
    return { success: true }
}
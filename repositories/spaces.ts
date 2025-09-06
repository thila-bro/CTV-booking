'use server'
import { sql } from '@/lib/pgsqlConnector';

export async function addSpaceRepo(Space: any) {
    const [insertSpace] = await sql`
        INSERT INTO spaces (id, name, price, start_time, end_time)
        VALUES (${crypto.randomUUID()}, ${Space.name}, ${parseInt(Space.price)}, ${Space.start_time}, ${Space.end_time})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Space added successfully', db: insertSpace };
}

export async function getAllSpacesRepo() {
    const spaces = await sql`SELECT * FROM spaces ORDER BY id DESC`;
    return spaces;
}

export async function deleteSpaceRepo(spaceId: string) {
    await sql`DELETE FROM space_images WHERE space_id = ${spaceId} `;
    await sql`DELETE FROM spaces WHERE id = ${spaceId} `;
    return { success: true };
}

export async function updateSpaceRepo(Space: any) {
    await sql `UPDATE spaces SET name=${Space.name}, price=${Space.price} WHERE id=${Space.id}`;
    return { success: true }
}

export async function findSpaceByIdRepo(spaceId: string) {
    const [space] = await sql`SELECT * FROM spaces WHERE id = ${spaceId}`;
    return space;
}
'use server'
import { sql } from '@/lib/pgsqlConnector';

export async function addSpaceRepo(Space: any) {
    const [insertSpace] = await sql`
        INSERT INTO spaces (name, start_time, end_time, price_per_hr, price_per_day, price_per_month, is_price_per_hr_enabled, is_price_per_day_enabled, is_price_per_month_enabled)
        VALUES (${Space.name}, ${Space.start_time}, ${Space.end_time}, ${Space.price_per_hr}, ${Space.price_per_day}, ${Space.price_per_month}, ${Space.is_price_per_hr_enabled}, ${Space.is_price_per_day_enabled}, ${Space.is_price_per_month_enabled})
        RETURNING *;
    `;
    return { message: 'Space added successfully', db: insertSpace };
}

export async function getAllSpacesRepo() {
    const spaces = await sql`SELECT * FROM spaces ORDER BY created_at DESC`;
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
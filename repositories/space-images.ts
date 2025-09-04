'use server';
import { sql } from "@/lib/pgsqlConnector";


export async function addSpaceImageRepo(space_id: string, image_path: string) {
    const result = await sql`
        INSERT INTO space_images (space_id, image_url)
        VALUES (${space_id}, ${image_path})
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    `;
    return result[0];
}
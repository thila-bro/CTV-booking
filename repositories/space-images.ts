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

export async function getSpaceImagesRepo(space_id: string) {
    const result = await sql`
        SELECT * FROM space_images
        WHERE space_id = ${space_id}
    `;
    return result;
}

export async function deleteSpaceImageRepo(imageId: string) {
    const result = await sql`
        DELETE FROM space_images
        WHERE id = ${imageId}
        RETURNING id
    `;
    return result[0];
}

export async function getImageDataById(imageId: string) {
    const result = await sql`
        SELECT * FROM space_images
        WHERE id = ${imageId}
    `;
    return result[0];
}
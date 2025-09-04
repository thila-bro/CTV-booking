'use server'

import { redirect } from 'next/navigation';
import { addSpaceRepo } from '@/repositories/spaces';
import { addSpaceImageRepo } from '@/repositories/space-images';
import { spacesImageDir } from '@/lib/constant';
import path from 'path';
import fs from 'fs/promises';


export async function addSpace(prevState: any, formData: FormData) {
    const name = formData.get('name');
    const price = formData.get('price');
    const images = formData.getAll('images') as File[];

    if (typeof name !== 'string' || typeof price !== 'string' || name.trim() === '' || price.trim() === '') {
        return {
            message: 'Invalid input. Name and price are required.',
        }
    }

    if (!images.length || images.every(img => img.size === 0)) {
        return {
            message: 'Please upload at least one image. Motherfucker!',
        }
    }

    const response = await addSpaceRepo({ name, price });

    if (response?.db?.id) {
        const uploadDir = path.join(process.cwd(), 'public',  `${spacesImageDir}`, response.db.id);
        await fs.mkdir(uploadDir, { recursive: true });

        const imagePaths: string[] = [];
        for (const image of images) {
            if (image.size === 0) continue;
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = path.join(uploadDir, image.name);
            await fs.writeFile(filePath, buffer);
            imagePaths.push(`${spacesImageDir}/${image.name}`);
            await addSpaceImageRepo(response.db.id, `${spacesImageDir}/${response.db.id}/${image.name}`);
        }

        return {
            message: "Space saved successfully",
            success: true
        }
    }

    // redirect('/admin/spaces/add');
}


// export async function deleteSpace(spaceId: String) {
//     const id = formData.get('id');
//     if (typeof id !== 'string' || id.trim() === '') {
//         return {
//             message: 'Invalid space ID.',
//         }
//     }
//     // Implement the delete functionality here, e.g., call a repository function to delete the space from the database. 
//     console.log("Delete space with ID:", id);
//     return {
//         message: `Space with ID ${id} deleted successfully.`,
//         success: true
//     }
// }
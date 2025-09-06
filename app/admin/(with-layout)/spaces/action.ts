'use server'

import { addSpaceRepo } from '@/repositories/spaces';
import { addSpaceImageRepo } from '@/repositories/space-images';
import { spacesImageDir } from '@/lib/constant';
import path from 'path';
import fs from 'fs/promises';
import { SpaceSchema } from '@/models/Space';


export async function addSpace(prevState: any, formData: FormData) {
    const validationResult = SpaceSchema.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        images: formData.getAll('images'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
    });

    if (!validationResult.success) {
        return { errors: validationResult.error.flatten().fieldErrors, data: Object.fromEntries(formData) };
    }

    const name = formData.get('name');
    const price = formData.get('price');
    const start_time = formData.get('start_time');
    const end_time = formData.get('end_time');
    const images = formData.getAll('images') as File[];

    const response = await addSpaceRepo({ name, price, start_time, end_time });

    if (response?.db?.id) {
        const uploadDir = path.join(process.cwd(), 'public', `${spacesImageDir}`, response.db.id);
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
}
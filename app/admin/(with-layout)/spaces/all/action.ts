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
        images: formData.getAll('images'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        price_per_hr: formData.get('price_per_hr_enabled') === 'on' ? formData.get('price_per_hr') : null,
        price_per_day: formData.get('price_per_day_enabled') === 'on' ? formData.get('price_per_day') : null,
        price_per_month: formData.get('price_per_month_enabled') === 'on' ? formData.get('price_per_month') : null,
    });

    if (!validationResult.success) {
        return { errors: validationResult.error.flatten().fieldErrors, data: Object.fromEntries(formData) };
    }

    const name = formData.get('name');
    const start_time = formData.get('start_time');
    const end_time = formData.get('end_time');
    const price_per_hr = formData.get('price_per_hr_enabled') === 'on' ? (formData.get('price_per_hr') || null) : null;
    const price_per_day = formData.get('price_per_day_enabled') === 'on' ? (formData.get('price_per_day') || null) : null;
    const price_per_month = formData.get('price_per_month_enabled') === 'on' ? (formData.get('price_per_month') || null) : null;
    const is_price_per_hr_enabled = formData.get('price_per_hr_enabled') === 'on' ? true : false;
    const is_price_per_day_enabled = formData.get('price_per_day_enabled') === 'on' ? true : false;
    const is_price_per_month_enabled = formData.get('price_per_month_enabled') === 'on' ? true : false;
    const images = formData.getAll('images') as File[];

    const response = await addSpaceRepo({ name, price_per_hr, price_per_day, price_per_month, start_time, end_time, is_price_per_hr_enabled, is_price_per_day_enabled, is_price_per_month_enabled });

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
'use server'

import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { addSpaceRepo } from '@/repositories/spaces';


export async function addSpace(prevState: any, formData: FormData) {
    const name = formData.get('name');
    const price = formData.get('price');
    

    if (typeof name !== 'string' || typeof price !== 'string' || name.trim() === '' || price.trim() === '') {
        return {
            message: 'Invalid input. Name and price are required.',
        }
    }

    const response = await addSpaceRepo({ name, price });

    if (response?.db?.id) {
        return {
            message: 'Space added successfully',
        }
    }
    // if (response?.message) {
    //     // return {
    //     //     message: response.message,
    //     // }
    // }

    // console.log('Add space response:', response);
    
    // const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
    // const [insertSpace] = await sql`
    //     INSERT INTO spaces (id, name, price)
    //     VALUES (${crypto.randomUUID()}, ${name}, ${parseInt(price)})
    //     ON CONFLICT (id) DO NOTHING
    //     RETURNING id;
    // `;

    // console.log('Inserted space:', insertSpace?.id);

    redirect('/admin/spaces/add');

}
'use server'
import postgres from 'postgres';


export async function addSpaceRepo(Space: any) {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
    const [insertSpace] = await sql`
        INSERT INTO spaces (id, name, price)
        VALUES (${crypto.randomUUID()}, ${Space.name}, ${parseInt(Space.price)})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Space added successfully', db: insertSpace }; 
}
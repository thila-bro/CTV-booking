'use server'

// import postgres from "postgres";
import bcrypt from 'bcrypt';
import { sql } from '@/lib/pgsqlConnector';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

export async function addUserRepo(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const [insertSpace] = await sql`
        INSERT INTO users (
	id, first_name, last_name, mobile, email, password)
	VALUES (${crypto.randomUUID()}, ${user.firstName}, ${user.lastName}, ${user.mobile}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'User added successfully', db: insertSpace };
}

export async function findUserByEmail(email: string) {
    const [user] = await sql`
        SELECT * FROM users WHERE email = ${email}
    `;
    return user;
}
'use server'
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

export async function register(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Email and password are required and must be strings.');
    }

    console.log('Registering user:', { email, password })

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertedAdmin = await sql`
        INSERT INTO admins (id, name, email, password)
        VALUES (${crypto.randomUUID()}, ${'New User'}, ${email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
    `;
    redirect('/login');
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Email and password are required and must be strings.');
    }

    console.log('Logging in user:', { email, password })

    const [admin] = await sql`
        SELECT * FROM admins WHERE email = ${email}
    `;

    if (!admin) {
        // throw new Error('No user found with this email.');
        return { 
            message: 'No user found with this email.'
            // errors:  
        }
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        // throw new Error('Invalid password.');
        return { message: 'Invalid password.2', ema1il: "email not found" }
    }

    redirect('/dashboard');
}

export async function logout() {
    // In a real application, you would clear the user's session or authentication token here.
    redirect('/login');
}

export async function createPost(prevState: any, formData: FormData) {
    // const title = formData.get('title')
    // const content = formData.get('content')

    // const res = await fetch('https://api.vercel.app/posts', {
    //     method: 'POST',
    //     body: { title, content },
    // })
    // const json = await res.json()

    // if (true) {
    //     return { message: 'Failed to create post' }
    // }

    return { message: 'Failed to create post' }
}
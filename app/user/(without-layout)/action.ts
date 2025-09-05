'use server'

import { addUserRepo, findUserByEmail } from '@/repositories/users';
import bcrypt from 'bcrypt';
import { redirect, RedirectType } from 'next/navigation';
import { UserSchema } from '@/models/User';
import { UserLoginSchema } from '@/models/UserLogin';
import { createSession, deleteSession } from '@/lib/session';

export async function addUser(prevState: any, formData: FormData) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const mobile = formData.get('mobile');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    const validationResult = UserSchema.safeParse({ firstName, lastName, email, mobile, password, confirmPassword });

    if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error.flatten().fieldErrors);
        return { 
            errors: validationResult.error.flatten().fieldErrors, 
            data: Object.fromEntries(formData) 
        };
    }

    // Add user to the database (pseudo code)
    // const response = await addUserRepo({ firstName, lastName, email, mobile, password });
    const response = await addUserRepo({ firstName, lastName, email, mobile, password });

    if (response?.db?.id) {
        return {
            message: "User registered successfully",
            success: true
        }
    }
}

export async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const validationResult = UserLoginSchema.safeParse({ email, password });

    if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error.flatten().fieldErrors);
        return {    
            errors: validationResult.error.flatten().fieldErrors,
            data: Object.fromEntries(formData)
        };
    }

    const user = email && typeof email === 'string' ? await findUserByEmail(email) : null;

    if (!user) {
        return {
            message: 'No user found with this email.'
        }
    }

    const isPasswordValid = password && typeof password === 'string' 
        ? await bcrypt.compare(password, user.password) 
        : false;

    if (!isPasswordValid) {
        // throw new Error('Invalid password.');
        return {
            message: 'Invalid password.',
            email: "email not found",
            data: Object.fromEntries(formData)
        }
    }

    await createSession(user.id, 'user');
    redirect('/user', RedirectType.replace);
}

export async function logoutUser() {
    await deleteSession("user");
    // await deleteSession("user");
    return;
}
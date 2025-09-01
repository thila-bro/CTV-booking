'use server'

import { addUserRepo, findUserByEmail } from '@/repositories/users';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

export async function addUser(prevState: any, formData: FormData) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const mobile = formData.get('mobile');
    const password = formData.get('password');
    const rePassword = formData.get('rePassword');

    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof mobile !== 'string' || typeof password !== 'string' || typeof rePassword !== 'string' || firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || mobile.trim() === '' || password.trim() === '' || rePassword.trim() === '') {
        return {
            message: 'Invalid input. All fields are required.',
            data: Object.fromEntries(formData)
        }
    }

    if (password !== rePassword) {
        return {
            message: 'Passwords do not match.',
            data: Object.fromEntries(formData)
        }
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

    if (typeof email !== 'string' || typeof password !== 'string' || email.trim() === '' || password.trim() === '') {
        return {
            message: 'Email and password are required.',
        }
    }

    const user = await findUserByEmail(email);

    if (!user) {
        return {
            message: 'No user found with this email.'
        }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        // throw new Error('Invalid password.');
        return {
            message: 'Invalid password.',
            email: "email not found",
            data: Object.fromEntries(formData)
        }
    }

    redirect('/user');
}
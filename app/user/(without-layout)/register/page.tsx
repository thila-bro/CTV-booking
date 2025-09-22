'use client'

import {
    CheckCircleIcon    
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Form from 'next/form';
import { useActionState } from 'react';
import { addUser } from '../action';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const initialState = {
    success: false,
    data: [],
    message: '',
    email: ''
}

export default function UserLoginForm() {
    const [state, formAction, pending] = useActionState(addUser, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    User Register
                </h2>
                <Form action={formAction} className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            First Name
                        </Label>
                        <Input
                            name="firstName"
                            type="firstName"
                            placeholder="John"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.firstName?.toString()}

                        />
                        {state?.errors?.firstName && (
                            <Label className="text-red-500">{state.errors.firstName}</Label>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </Label>
                        <Input
                            name="lastName"
                            type="lastName"
                            placeholder="Doe"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.lastName?.toString()}

                        />
                        {state?.errors?.lastName && (
                            <Label className="text-red-500">{state.errors.lastName}</Label>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Mobile Number
                        </Label>
                        <Input
                            name="mobile"
                            type="mobile"
                            placeholder="(123) 456-7890"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.mobile?.toString()}

                        />
                        {state?.errors?.mobile && (
                            <Label className="text-red-500">{state.errors.mobile}</Label>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="john.doe@email.com"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.email?.toString()}

                        />
                        {state?.errors?.email && (
                            <Label className="text-red-500">{state.errors.email}</Label>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"

                        />
                        {state?.errors?.password && (
                            <Label className="text-red-500">{state.errors.password}</Label>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Retype Password
                        </Label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"

                        />
                        {state?.errors?.confirmPassword && (
                            <Label className="text-red-500">{state.errors.confirmPassword}</Label>
                        )}
                    </div>
                    {state?.success && (
                        <div className="flex mt-2 items-center text-green-600 ">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <p aria-live="polite">{state.message}</p>
                        </div>
                    )}
                    <Button className="w-full rounded-md py-2 px-4 " disabled={pending}>
                        Register
                    </Button>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/user/login" className="font-semibold">
                            Login
                        </Link>
                    </p>
                </Form>
            </div>
        </div>
    );
}

'use client'

import {
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import Form from 'next/form';
import { useActionState } from 'react';
import { addUser } from '../action';


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
                        <label className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            name="firstName"
                            type="firstName"
                            placeholder="John"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.firstName?.toString()}

                        />
                        {state?.errors?.firstName && (
                            <p className="text-red-500">{state.errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            name="lastName"
                            type="lastName"
                            placeholder="Doe"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.lastName?.toString()}

                        />
                        {state?.errors?.lastName && (
                            <p className="text-red-500">{state.errors.lastName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mobile Number
                        </label>
                        <input
                            name="mobile"
                            type="mobile"
                            placeholder="(123) 456-7890"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.mobile?.toString()}

                        />
                        {state?.errors?.mobile && (
                            <p className="text-red-500">{state.errors.mobile}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john.doe@email.com"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            defaultValue={state?.data?.email?.toString()}

                        />
                        {state?.errors?.email && (
                            <p className="text-red-500">{state.errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"

                        />
                        {state?.errors?.password && (
                            <p className="text-red-500">{state.errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Retype Password
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"

                        />
                        {state?.errors?.confirmPassword && (
                            <p className="text-red-500">{state.errors.confirmPassword}</p>
                        )}
                    </div>
                    {state?.success && (
                        <div className="flex mt-2 items-center text-green-600 ">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <p aria-live="polite">{state.message}</p>
                        </div>
                    )}
                    <Button className="w-full rounded-md bg-gray-600 py-2 px-4 text-white hover:bg-gray-700 focus:outline-none" disabled={pending}>
                        Register
                    </Button>
                </Form>
            </div>
        </div>
    );
}

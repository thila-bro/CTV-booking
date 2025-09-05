'use client'
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import Form from 'next/form';
import { login } from '@/app/lib/admin';
import { useActionState } from 'react';
import { AdminLogin } from './action';


const initialState = {
  message: '',
  email: ''
}

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(AdminLogin, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Admin Login
        </h2>
        <Form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"

            />
            {state?.errors?.email && (
              <p className="text-red-500">{state.errors.email}</p>
            )}
            {/* {state?.message?.email && (<p aria-live="polite">{state.message?.email}</p>)} */}
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
          </div>
          {state?.errors?.password && (
            <p className="text-red-500">{state.errors.password}</p>
          )}
          {state?.message && <p className="text-red-500">{state.message}</p>}

          <Button className="w-full rounded-md bg-gray-600 py-2 px-4 text-white hover:bg-gray-700 focus:outline-none" disabled={pending}>
            Log in
          </Button>
        </Form>

      </div>
    </div>
  );
}

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


const initialState = {
  message: '',
  email: ''
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

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
              required
            />
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
              required
            />
          </div>
          {state?.message && <p aria-live="polite">{state.message}</p>}
          {/* <button
            type="submit"
            className="w-full rounded-md bg-gray-600 py-2 px-4 text-white hover:bg-gray-700 focus:outline-none"
          >
            Log In
          </button> */}
          <Button className="w-full rounded-md bg-gray-600 py-2 px-4 text-white hover:bg-gray-700 focus:outline-none" disabled={pending}>
            Log in
          </Button>
        </Form>
        {/* <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-gray-600 hover:underline">
            Sign up
          </a>
        </p> */}
      </div>
    </div>
  );
}

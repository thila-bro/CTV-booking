'use client'

import Form from 'next/form';
import { useActionState } from 'react';
import { AdminLogin } from './action';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";


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
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md p-2 "

            />
            {state?.errors?.email && (
              <Label htmlFor="email" className="text-red-500">{state.errors.email}</Label>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"

            />
          </div>
          {state?.errors?.password && (
            <Label htmlFor="password" className="text-red-500">{state.errors.password}</Label>
          )}
          {state?.message && <Label className="text-red-500">{state.message}</Label>}
          <Button className="w-full rounded-md py-2 px-4 " disabled={pending}>
            Log in
          </Button>
        </Form>

      </div>
    </div>
  );
}

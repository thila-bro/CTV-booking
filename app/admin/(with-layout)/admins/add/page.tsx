"use client";
import React, { useActionState, useState } from "react";
import { register } from "@/app/lib/admin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/app/ui/button";
import { addAdmin } from "../action";
import { toast } from "sonner";


const initialState = {
    success: false,
    message: '',
    email: ''
};
export default function AddAdmin() {
    const [state, formAction, pending] = useActionState(addAdmin, initialState);


    if (state?.success) {
        state.success = false; // Reset success state to prevent repeated toasts
        state.message = ''; // Reset message state
        toast.success("Admin added successfully!");
    }


    return (
        <div className=" mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6 ">Add Admin</h1>
            <form action={formAction} className="space-y-4">
                <div>
                    <Label htmlFor="name" className="block font-medium mb-1">Name
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full border px-3 py-2 rounded"
                        defaultValue={typeof state?.data?.name === "string" ? state.data.name : ""}
                    />
                    {state?.errors?.name && <p className="text-red-600 text-sm mt-1">{state.errors.name}</p>}
                </div>
                <div>
                    <Label htmlFor="email" className="block font-medium mb-1">Email
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="border px-3 py-2 rounded"
                        defaultValue={typeof state?.data?.email === "string" ? state.data.email : ""}
                    />
                    {state?.errors?.email && <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>}
                </div>
                <div>
                    <Label htmlFor="password" className="block font-medium mb-1">Password
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="border px-3 py-2 rounded"
                    />
                    {state?.errors?.password && <p className="text-red-600 text-sm mt-1">{state.errors.password}</p>}
                </div>
                <Button
                    type="submit"
                    className="py-2 rounded font-semibold"
                    disabled={pending}
                >
                    {pending ? "Adding..." : "Add Admin"}
                </Button>
            </form>
        </div>
    );
}

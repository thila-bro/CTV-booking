'use client'

import {
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { addSpace } from '../action';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@radix-ui/react-label';

const initialState = {
    success: false,
    message: '',
    email: ''
}

export default function AddSpaceForm() {
    const [state, formAction, pending] = useActionState(addSpace, initialState);
    const [startTime, setStartTime] = useState('08:00:00');
    const [endTime, setEndTime] = useState('15:00:00');

    // Custom submit handler to include time picker values
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('start_time', startTime);
        formData.set('end_time', endTime);

        formAction(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-auto bg-white p-8 rounded-lg shadow space-y-6"
            encType="multipart/form-data"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Space</h2>
            {/* <Button >Add Space</Button> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        required placeholder="Enter product name"
                        defaultValue={typeof state?.data?.name === 'string' ? state.data.name : ''}
                    />
                    {state?.errors?.name && (
                        <p className="text-red-500">{state.errors.name}</p>
                    )}
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Hr ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="1"
                        required
                        placeholder="Enter price"
                        defaultValue={typeof state?.data?.price === 'string' ? state.data.price : ''}
                    />
                    {state?.errors?.price && (
                        <p className="text-red-500">{state.errors.price}</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="time"
                        id="time-picker"
                        name='start_time'
                        onChange={(e) => setStartTime(e.target.value)}
                        step="1"
                        defaultValue="08:00:00"
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {state?.errors?.start_time && (
                        <Label className="text-red-500">{state.errors.start_time}</Label>
                    )}
                </div>
                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="time"
                        id="time-picker"
                        name='end_time'
                        step="1"
                        defaultValue="15:00:00"
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {state?.errors?.end_time && (
                        <Label className="text-red-500">{state.errors.end_time}</Label>
                    )}
                </div>
            </div>
            <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images <span className="text-red-500">*</span>
                </Label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    required
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             hover:file:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">You can upload multiple images (PNG, JPG, etc.)</p>
                {state?.errors?.images && (
                    <p className="text-red-500">{state.errors.images}</p>
                )}
            </div>

            {state?.message && !state?.success && (
                <div className="flex mt-2 items-center text-red-600 ">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    <p aria-live="polite">{state.message}</p>
                </div>
            )}

            {state?.success && (
                <div className="flex mt-2 items-center text-green-600 ">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <p aria-live="polite">{state.message}</p>
                </div>
            )}

            <div className="pt-4">
                <Button
                    type="submit"
                >
                    Save
                </Button>
            </div>
        </form>
    );
}
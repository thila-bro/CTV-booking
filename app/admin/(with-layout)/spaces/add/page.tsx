'use client'

import {
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { addSpace } from '../action';


const initialState = {
    success: false,
    message: '',
    email: ''
}

export default function AddSpaceForm() {
    const [state, formAction, pending] = useActionState(addSpace, initialState)
    console.log("form state: ", state);


    return (
        <form action={formAction}
            className="max-w-auto  bg-white p-8 rounded-lg shadow space-y-6"
        // onsubmit="return validateForm()"
            encType="multipart/form-data"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Space</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:border-blue-400"
                        placeholder="Enter product name"
                        defaultValue={typeof state?.data?.name === 'string' ? state.data.name : ''}
                    />
                    {state?.errors?.name && (
                        <p className="text-red-500">{state.errors.name}</p>
                    )}
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="1"
                        required
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:border-blue-400"
                        placeholder="Enter price"
                        defaultValue={typeof state?.data?.price === 'string' ? state.data.price : ''}
                    />
                    {state?.errors?.price && (
                        <p className="text-red-500">{state.errors.price}</p>
                    )}
                </div>
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images <span className="text-red-500">*</span>
                </label>
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
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100"
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
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </div>
        </form>


    );
}

'use client'
import { lusitana } from '@/app/ui/fonts';
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { Button } from '../ui/button';
import Form from 'next/form';
import { useActionState } from 'react';
import { addSpace } from '../action';


const initialState = {
    message: '',
    email: ''
}

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(addSpace, initialState)

    return (
        <Form action={formAction}
            className="max-w-auto  bg-white p-8 rounded-lg shadow space-y-6"
            // onsubmit="return validateForm()"
            
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                    <label  className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:border-blue-400"
                        placeholder="Enter product name"
                    />
                </div>

                
                <div>
                    <label  className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="1"
                        
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:border-blue-400"
                        placeholder="Enter price"
                    />
                </div>
            </div>

            
            <div>
                <label  className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images <span className="text-red-500">*</span>
                </label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">You can upload multiple images (PNG, JPG, etc.)</p>
            </div>

            {state?.message && (
                <div className="flex items-center text-red-600 mt-2">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
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
        </Form>


    );
}

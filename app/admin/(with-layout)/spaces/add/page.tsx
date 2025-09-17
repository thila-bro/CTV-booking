'use client'

import {
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { addSpace } from '../action';
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@radix-ui/react-label';
import { Checkbox } from '@/components/ui/checkbox';

const initialState = {
    success: false,
    message: '',
    email: ''
}

export default function AddSpaceForm() {
    const [state, formAction, pending] = useActionState(addSpace, initialState);
    const [startTime, setStartTime] = useState('08:00:00');
    const [endTime, setEndTime] = useState('15:00:00');
    const [pricePerHrEnabled, setPricePerHrEnabled] = useState(true);
    const [pricePerDayEnabled, setPricePerDayEnabled] = useState(false);
    const [pricePerMonthEnabled, setPricePerMonthEnabled] = useState(false);


    // Custom submit handler to include time picker values
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('start_time', startTime);
        formData.set('end_time', endTime);

        formAction(formData);
    };

    
    // const formRef = useRef<HTMLFormElement>(null);

    // if (state?.success && formRef.current) {
    //     console.log('Resetting form after successful submission');
    //     formRef.current.reset();
    //     setStartTime('08:00:00');
    //     setEndTime('15:00:00');
    //     setPricePerHrEnabled(true);
    //     setPricePerDayEnabled(false);
    //     setPricePerMonthEnabled(false);
    // }
    // useEffect(() => {

    //     if (state?.success) {
    //         console.log('Form submitted successfully:', state);
    //     }
    //     if (state?.success && formRef.current) {
    //         console.log('Resetting form after successful submission');
    //         formRef.current.reset();
    //         setStartTime('08:00:00');
    //         setEndTime('15:00:00');
    //         setPricePerHrEnabled(true);
    //         setPricePerDayEnabled(false);
    //         setPricePerMonthEnabled(false);
    //     }
    // }, [initialState.success]);


    return (
        <form
            // ref={formRef}
            onSubmit={handleSubmit}
            className="mx-auto bg-white p-8 rounded-lg shadow space-y-6"
            encType="multipart/form-data"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Space</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Form fields */}
                <div>
                    <div className="grid grid-cols-1 gap-6">
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
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    id="price_per_hr"
                                    name="price_per_hr"
                                    min="0"
                                    step="1"
                                    required
                                    placeholder="Enter price"
                                    disabled={!pricePerHrEnabled}
                                    defaultValue={typeof state?.data?.price === 'string' ? state.data.price : ''}
                                />
                                <Checkbox
                                    id="price_per_hr_enabled"
                                    name="price_per_hr_enabled"
                                    checked={pricePerHrEnabled}
                                    onCheckedChange={(checked) => setPricePerHrEnabled(checked === true)}
                                />
                                <Label htmlFor="price_per_hr_enabled">Available</Label>
                            </div>
                            {state?.errors?.price_per_hr && (
                                <p className="text-red-500">{state.errors.price_per_hr}</p>
                            )}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                Price Per Day ($) <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    id="price_per_day"
                                    name="price_per_day"
                                    min="0"
                                    step="1"
                                    required
                                    placeholder="Enter price"
                                    disabled={!pricePerDayEnabled}
                                    defaultValue={typeof state?.data?.price === 'string' ? state.data.price : ''}
                                />
                                <Checkbox
                                    id="price_per_day_enabled"
                                    name="price_per_day_enabled"
                                    checked={pricePerDayEnabled}
                                    onCheckedChange={(checked) => setPricePerDayEnabled(checked === true)}
                                />
                                <Label htmlFor="price_per_day_enabled">Available</Label>
                            </div>
                            {state?.errors?.price_per_day && (
                                <p className="text-red-500">{state.errors.price_per_day}</p>
                            )}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                Price Per Month ($) <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    id="price_per_month"
                                    name="price_per_month"
                                    min="0"
                                    step="1"
                                    required
                                    placeholder="Enter price"
                                    disabled={!pricePerMonthEnabled}
                                    defaultValue={typeof state?.data?.price === 'string' ? state.data.price : ''}
                                />
                                <Checkbox
                                    id="price_per_month_enabled"
                                    name="price_per_month_enabled"
                                    checked={pricePerMonthEnabled}
                                    onCheckedChange={(checked) => setPricePerMonthEnabled(checked === true)}
                                />
                                <Label htmlFor="price_per_month_enabled">Available</Label>
                            </div>
                            {state?.errors?.price_per_month && (
                                <p className="text-red-500">{state.errors.price_per_month}</p>
                            )}
                        </div>

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
                </div>
                {/* Right side: Image uploader */}
                <div className="flex flex-col justify-center h-full">
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
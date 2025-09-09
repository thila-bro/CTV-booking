"use client";

import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findSpaceByIdRepo } from "@/repositories/spaces";
import { redirect } from 'next/navigation';
import { dateFormat, formatTime } from "@/lib/global";
import { useActionState } from 'react';
import { checkSpaceAvailability } from "./action";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const initialState = {
    success: false,
    message: ''
}

export default function CheckoutPage() {
    const [state, formAction, pending] = useActionState(checkSpaceAvailability, initialState)
    const successRouter = useRouter();
    const searchParams = useSearchParams();
    const spaceId = searchParams.get("spaceId") || "";

    const currentDate = new Date();
    const pickerStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const maxPickerDate = new Date(currentDate.getTime() + 21 * 24 * 60 * 60 * 1000);

    type SpaceType = {
        id: string;
        name: string;
        price: number;
        start_time: string;
        end_time: string;
        // add other fields if needed
    };
    const [space, setSpace] = useState<SpaceType | null>(null);
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | null>(new Date());

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    useEffect(() => {
        const fetchSpace = async () => {
            const spaceData = await findSpaceByIdRepo(spaceId);
            setSpace(spaceData as SpaceType);
        };
        fetchSpace();
    }, [spaceId]);

    // Start and End Time (HH:mm)
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("15:00");
    const [totalPrice, setTotalPrice] = useState(0);

    const pricePerHour = space?.price ?? 20;

    // Calculate price whenever times change
    useEffect(() => {
        if (startTime && endTime) {
            const [startH, startM] = startTime.split(":").map(Number);
            const [endH, endM] = endTime.split(":").map(Number);
            const start = startH * 60 + startM;
            const end = endH * 60 + endM;
            const diffMin = end - start;
            const diffHrs = diffMin / 60;
            if (diffHrs >= 0.5) {
                setTotalPrice(diffHrs * pricePerHour);
            } else {
                setTotalPrice(0);
            }
        }
    }, [startTime, endTime, pricePerHour]);

    // Prevent booking if duration < 30 mins
    const handleCheckout = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('date', date ? dateFormat(date as Date) : "");
        formData.set('spaceId', spaceId);
        formData.set('totalPrice', totalPrice.toString());

        formAction(formData);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    
    useEffect(() => {
        if (state.success) {
            redirect(`/user/payment/?preBookingId=${state.db?.db.id}`);
        }
    }, [state.success, successRouter]);

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Checkout
                </h1>

                {/* Split into two columns before summary */}
                <form className="mb-6" onSubmit={handleCheckout}>
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* Left: Booking Form */}
                        <div className="flex-1">
                            {/* Space Details */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold">{space ? space.name : "Loading..."}</h2>
                                <p className="text-gray-600">B-Lab • ${space ? space.price : 0}/hr</p>
                            </div>

                            {/* Date & Time Picker */}
                            <div className="grid gap-6 mb-8">
                                {/* Show available time period for the space */}
                                {space && (
                                    <div className="mb-2">
                                        <span className="font-medium text-gray-700">Available Time:</span>
                                        <span className="ml-2 text-gray-900">{formatTime(space.start_time)} - {formatTime(space.end_time)}</span>
                                    </div>
                                )}
                                <div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="date" className="px-1">
                                            Pick a date
                                        </Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="justify-between font-normal"
                                                >
                                                    {date ? date.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date || undefined}
                                                    // onSelect={setDate}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDate(date ?? null)
                                                        setOpen(false)
                                                    }}
                                                    disabled={(date) =>
                                                        date < pickerStartDate ||
                                                        date > maxPickerDate ||
                                                        date.getDay() === 0 ||
                                                        date.getDay() === 6
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor="start_time" className="block mb-1">Start Time</Label>
                                        <Input
                                            type="time"
                                            id="start_time"
                                            name="start_time"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="end_time" className="block mb-1">End Time</Label>
                                        <Input
                                            type="time"
                                            id="end_time"
                                            name="end_time"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {state?.message && !state?.success && (
                                <div className="flex mt-2 items-center text-red-600 ">
                                    <p aria-live="polite">{state.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Image Carousel */}
                        <div className="flex-1 flex items-center justify-center">
                            <Carousel className="w-full max-w-xs"
                                plugins={[plugin.current]}
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}>
                                <CarouselContent>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>


                    {/* Booking Summary */}
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold mb-2">Booking Summary</h3>
                        <p>
                            <span className="font-medium">Date:</span>{" "}
                            {mounted && date ? date.toLocaleDateString() : "Not selected"}
                        </p>
                        <p>
                            <span className="font-medium">Start Time:</span>{" "}
                            {startTime}
                        </p>
                        <p>
                            <span className="font-medium">End Time:</span>{" "}
                            {endTime}
                        </p>
                        <p className="mt-2 text-lg font-semibold ">
                            Total Price:{" "}
                            {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "—"}
                        </p>
                    </div>

                    {/* Checkout Button */}
                    <Button
                        type="submit"
                        disabled={pending}
                        className="w-full py-3 font-semibold rounded-lg shadow transition"
                    >
                        Confirm & Proceed to Payment
                    </Button>
                </form>
            </div>
        </main >
    );
}

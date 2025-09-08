"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findSpaceByIdRepo } from "@/repositories/spaces";
import Autoplay from "embla-carousel-autoplay";
import { redirect } from 'next/navigation';
import { formatTimeHM } from "@/lib/global";
import Form from "next/form";
import { useActionState } from 'react';
import { checkSpaceAvailability } from "./action";

const initialState = {
    success: false,
    message: '',
    email: '',
    data: []
}

export default function CheckoutPage() {
    const [state, formAction, pending] = useActionState(checkSpaceAvailability, initialState)
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
    const [date, setDate] = useState<Date | undefined>(
        new Date()
    )

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
    const handleCheckout = () => {
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const start = startH * 60 + startM;
        const end = endH * 60 + endM;
        // Validate minimum duration
        if (end - start < 30) {
            alert("Minimum booking is 30 minutes.");
            return;
        }
        // Validate available time range
        if (space) {
            const [availStartH, availStartM] = space.start_time.split(":").map(Number);
            const [availEndH, availEndM] = space.end_time.split(":").map(Number);
            const availStart = availStartH * 60 + availStartM;
            const availEnd = availEndH * 60 + availEndM;
            if (start < availStart || end > availEnd) {
                alert(`Selected time is out of available range (${space.start_time} - ${space.end_time}).`);
                return;
            }
        }
        // Build query string with booking details
        const params = new URLSearchParams({
            spaceId: space?.id || "",
            spaceName: space?.name || "",
            date: date ? date.toISOString().split('T')[0] : "",
            startTime,
            endTime,
            totalPrice: totalPrice.toString(),
        });
        redirect(`/user/payment?${params.toString()}`);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Checkout
                </h1>

                {/* Split into two columns before summary */}
                <Form action={formAction} className="mb-6">
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
                                        <span className="ml-2 text-gray-900">{formatTimeHM(space.start_time)} - {formatTimeHM(space.end_time)}</span>
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
                                                    selected={date}
                                                    // onSelect={setDate}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDate(date)
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
                        // onClick={handleCheckout}
                        // type="submit"
                        disabled={totalPrice === 0 || pending}
                        className="w-full py-3 font-semibold rounded-lg shadow transition"
                    >
                        Confirm & Proceed to Payment
                    </Button>
                </Form>
            </div>
        </main >
    );
}

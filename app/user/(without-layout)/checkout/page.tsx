"use client";

import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findSpaceByIdRepo } from "@/repositories/spaces";
import { dateFormat } from "@/lib/global";
import { useActionState } from "react";
import { checkSpaceAvailability } from "./action";
import { Calendar } from "@/components/ui/calendar";
import { MonthRangePicker } from "@/components/ui/monthrangepicker";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { type DateRange } from "react-day-picker";
import { countActiveWeekdays } from "@/lib/global";
import { startOfMonth, endOfMonth } from "date-fns";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const initialState = {
    success: false,
    message: "",
};

export default function CheckoutPage() {
    const [state, formAction, pending] = useActionState(checkSpaceAvailability, initialState);
    const router = useRouter();
    const searchParams = useSearchParams();
    const spaceId = searchParams.get("spaceId") || "";

    const currentDate = new Date();
    const pickerStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    const maxPickerDate = new Date(currentDate.getTime() + 21 * 24 * 60 * 60 * 1000);

    type SpaceType = {
        id: string;
        name: string;
        price_per_hr: number;
        price_per_day?: number;
        price_per_month?: number;
        start_time: string;
        end_time: string;
        is_price_per_hr_enabled?: boolean;
        is_price_per_day_enabled?: boolean;
        is_price_per_month_enabled?: boolean;
        images?: string[];
    };
    const [space, setSpace] = useState<SpaceType | null>(null);
    const [open, setOpen] = useState(false);

    // Booking type: hour, day, month
    const [bookingType, setBookingType] = useState<"hour" | "day" | "month">("hour");

    // Hourly booking states
    const [date, setDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("15:00");

    // Day booking states
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [numDays, setNumDays] = useState(1);

    // Month booking states
    const [monthRange, setMonthRange] = useState<{ start: Date; end: Date } | undefined>();
    const [numMonths, setNumMonths] = useState(1);

    // Price calculation
    const [totalPrice, setTotalPrice] = useState(0);

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    useEffect(() => {
        const fetchSpace = async () => {
            const spaceData = await findSpaceByIdRepo(spaceId);
            setSpace(spaceData as SpaceType);
        };
        fetchSpace();
    }, [spaceId]);

    // Corrected price calculation
    useEffect(() => {
        if (!space) return;

        if (bookingType === "hour" && space.is_price_per_hr_enabled) {
            const [startH, startM] = startTime.split(":").map(Number);
            const [endH, endM] = endTime.split(":").map(Number);
            const start = startH * 60 + startM;
            const end = endH * 60 + endM;
            const diffMin = end - start;
            const diffHrs = diffMin / 60;
            setTotalPrice(diffHrs >= 0.5 ? diffHrs * space.price_per_hr : 0);
        } else if (bookingType === "day" && space.is_price_per_day_enabled) {
            let activeDays = 0;
            if (dateRange?.from && dateRange?.to) {
                activeDays = countActiveWeekdays(dateRange.from, dateRange.to);
            }
            setNumDays(activeDays);
            setTotalPrice(activeDays > 0 ? activeDays * (space.price_per_day ?? 0) : 0);
        } else if (bookingType === "month" && space.is_price_per_month_enabled) {
            let months = numMonths;
            if (monthRange?.start && monthRange?.end) {
                months = differenceInMonths(monthRange.end, monthRange.start) + 1;
            }
            setTotalPrice(months > 0 ? months * (space.price_per_month ?? 0) : 0);
            setNumMonths(months);
        } else {
            setTotalPrice(0);
        }
    }, [bookingType, startTime, endTime, numDays, numMonths, space, dateRange, monthRange]);

    // Prevent booking if duration < 30 mins for hourly
    const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("spaceId", spaceId);
        formData.set("bookingType", bookingType);
        formData.set("totalPrice", totalPrice.toString());

        if (bookingType === "hour") {
            formData.set("date", date ? format(date, "yyyy-MM-dd") : "");
            formData.set("start_time", startTime);
            formData.set("end_time", endTime);
        } else if (bookingType === "day") {
            formData.set("start_date", dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "");
            formData.set("end_date", dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "");
            formData.set("num_days", numDays.toString());
        } else if (bookingType === "month") {
            formData.set("start_month", monthRange?.start ? format(monthRange.start, "yyyy-MM") : "");
            formData.set("end_month", monthRange?.end ? format(endOfMonth(monthRange.end), "yyyy-MM-dd") : "");
            formData.set("num_months", Number(numMonths).toString());
        }

        formAction(formData);
    };

    useEffect(() => {
        if (state.success) {
            router.push(`/user/payment/?preBookingId=${state.db?.db.id}`);
        }
    }, [state.success, router, state.db]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Checkout
                </h1>

                <form className="mb-6" onSubmit={handleCheckout}>
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* Left: Booking Form */}
                        <div className="flex-1">
                            {/* Space Details */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold">{space ? space.name : "Loading..."}</h2>
                                <p className="text-gray-600">
                                    {space?.is_price_per_hr_enabled && <>${space.price_per_hr}/hr &nbsp;</>}
                                    {space?.is_price_per_day_enabled && <>| ${space.price_per_day}/day &nbsp;</>}
                                    {space?.is_price_per_month_enabled && <>| ${space.price_per_month}/month</>}
                                </p>
                            </div>

                            {/* Booking Type Picker */}
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booking Type
                                </Label>
                                <div className="flex gap-4">
                                    {space?.is_price_per_hr_enabled && (
                                        <Button
                                            type="button"
                                            variant={bookingType === "hour" ? "default" : "outline"}
                                            onClick={() => setBookingType("hour")}
                                        >
                                            Hour
                                        </Button>
                                    )}
                                    {space?.is_price_per_day_enabled && (
                                        <Button
                                            type="button"
                                            variant={bookingType === "day" ? "default" : "outline"}
                                            onClick={() => setBookingType("day")}
                                        >
                                            Day
                                        </Button>
                                    )}
                                    {space?.is_price_per_month_enabled && (
                                        <Button
                                            type="button"
                                            variant={bookingType === "month" ? "default" : "outline"}
                                            onClick={() => setBookingType("month")}
                                        >
                                            Month
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Date Picker Section */}
                            <div className="mb-4">
                                <Label htmlFor="date" className="px-1">
                                    {bookingType === "hour" && "Pick a date"}
                                    {bookingType === "day" && "Pick a date range"}
                                    {bookingType === "month" && "Pick a month range"}
                                </Label>
                                {bookingType === "hour" && (
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="justify-between font-normal"
                                            >
                                                {date ? format(date, "PPP") : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date || undefined}
                                                captionLayout="dropdown"
                                                onSelect={(d) => {
                                                    setDate(d ?? null);
                                                    setOpen(false);
                                                }}
                                                disabled={(d) =>
                                                    d < pickerStartDate ||
                                                    d > maxPickerDate ||
                                                    d.getDay() === 0 ||
                                                    d.getDay() === 6
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {bookingType === "day" && (
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date-range"
                                                className="justify-between font-normal"
                                            >
                                                {dateRange?.from && dateRange?.to
                                                    ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                                                    : "Select date range"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="range"
                                                selected={dateRange}
                                                captionLayout="dropdown"
                                                onSelect={(range) => {
                                                    setDateRange(range as DateRange);
                                                    setOpen(false);
                                                }}
                                                disabled={(d) =>
                                                    d < pickerStartDate ||
                                                    d > maxPickerDate ||
                                                    d.getDay() === 0 ||
                                                    d.getDay() === 6
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {bookingType === "month" && (
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="month-range"
                                                className="justify-between font-normal"
                                            >
                                                {monthRange?.start && monthRange?.end
                                                    ? `${format(monthRange.start, "MMM yyyy")} - ${format(monthRange.end, "MMM yyyy")}`
                                                    : "Select month range"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <MonthRangePicker
                                                selectedMonthRange={monthRange}
                                                onMonthRangeSelect={setMonthRange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>

                            {/* Booking Details */}
                            {bookingType === "hour" && (
                                <div className="flex gap-4 mb-4">
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
                            )}
                            {/* {bookingType === "day" && (
                                <div className="mb-4">
                                    <Label htmlFor="num_days" className="block mb-1">Number of Days</Label>
                                    <Input
                                        type="number"
                                        id="num_days"
                                        name="num_days"
                                        min={1}
                                        max={30}
                                        value={numDays}
                                        onChange={e => setNumDays(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            )}
                            {bookingType === "month" && (
                                <div className="mb-4">
                                    <Label htmlFor="num_months" className="block mb-1">Number of Months</Label>
                                    <Input
                                        type="number"
                                        id="num_months"
                                        name="num_months"
                                        min={1}
                                        max={12}
                                        value={numMonths}
                                        onChange={e => setNumMonths(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            )} */}

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
                                    {(space?.images?.length
                                        ? space.images
                                        : Array.from({ length: 5 }).map((_, i) => `/sample${i + 1}.avif`)
                                    ).map((img, idx) => (
                                        <CarouselItem key={idx}>
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                                        <img src={img} alt={`Space image ${idx + 1}`} className="object-cover w-full h-full rounded-lg" />
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
                        {bookingType === "hour" && (
                            <>
                                <p>
                                    <span className="font-medium">Date:</span>{" "}
                                    {date ? format(date, "PPP") : "Not selected"}
                                </p>
                                <p>
                                    <span className="font-medium">Start Time:</span>{" "}
                                    {startTime}
                                </p>
                                <p>
                                    <span className="font-medium">End Time:</span>{" "}
                                    {endTime}
                                </p>
                            </>
                        )}
                        {bookingType === "day" && (
                            <>
                                <p>
                                    <span className="font-medium">Date Range:</span>{" "}
                                    {dateRange?.from && dateRange?.to
                                        ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                                        : "Not selected"}
                                </p>
                                <p>
                                    <span className="font-medium">Days:</span>{" "}
                                    {numDays}
                                </p>
                            </>
                        )}
                        {bookingType === "month" && (
                            <>
                                <p>
                                    <span className="font-medium">Month Range:</span>{" "}
                                    {monthRange?.start && monthRange?.end
                                        ? `${format(monthRange.start, "MMM yyyy")} - ${format(monthRange.end, "MMM yyyy")}`
                                        : "Not selected"}
                                </p>
                                <p>
                                    <span className="font-medium">Months:</span>{" "}
                                    {numMonths}
                                </p>
                            </>
                        )}
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
        </main>
    );
}
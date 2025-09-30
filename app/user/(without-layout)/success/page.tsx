"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTempBookingByIdWithUserNSpaceRepo, deleteTempBookingByIdRepo } from "@/repositories/temp-booking";
import { Row } from "postgres";
import { formatTime } from "@/lib/global";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { sendTestEmail2 } from "@/lib/email";


export default function SuccessPage() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const preBookingId = searchParams.get("preBookingId");
    const [isLoading, setIsLoading] = useState(true);
    const [tempBooking, setTempBooking] = useState<Row | null>(null);

    useEffect(() => {
        if (preBookingId) {
            setIsLoading(true);
            getTempBookingByIdWithUserNSpaceRepo(preBookingId as string).then((data) => {
                // If no data, redirect to home
                if (!data) {
                    router.push("/");
                    return;
                }
                setTempBooking(data);
                deleteTempBookingByIdRepo(preBookingId as string);
                setIsLoading(false);
                sendTestEmail2(data);
            });
        }
    }, [preBookingId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">
                {/* Success Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-green-600 mb-3">
                    Booking Confirmed!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your booking was successful. We’ve sent a confirmation email with your
                    booking details.
                </p>

                {/* Booking Summary Example */}
                <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
                    <h3 className="font-semibold mb-2">Booking Details</h3>
                    <p>
                        <span className="font-medium">Space:</span>{tempBooking?.space.name}
                    </p>
                    {tempBooking?.type === "hour" && (
                        <>
                            <p>
                                <span className="font-medium">Date:</span> {tempBooking.date ? new Date(tempBooking.date).toLocaleDateString() : "--"}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span> {formatTime(tempBooking?.start_time)} - {formatTime(tempBooking?.end_time)}
                            </p>
                        </>
                    )}
                    {tempBooking?.type === "day" && (
                        <>
                            <p>
                                <span className="font-medium">Start:</span> {format(tempBooking?.start_date, "dd MMMM, Y") ?? "--"}
                            </p>
                            <p>
                                <span className="font-medium">End:</span> {format(tempBooking?.end_date, "dd MMMM, Y") ?? "--"}
                            </p>
                            <p>
                                <span className="font-medium">Total Days:</span> {tempBooking?.duration ?? "--"}
                            </p>
                        </>
                    )}
                    {tempBooking?.type === "month" && (
                        <>
                            <p>
                                <span className="font-medium">Start:</span> {format(tempBooking?.start_date, "MMMM, Y") ?? "--"}
                            </p>
                            <p>
                                <span className="font-medium">End:</span> {format(tempBooking?.end_date, "MMMM, Y") ?? "--"}
                            </p>
                            <p>
                                <span className="font-medium">Months:</span> {tempBooking?.duration ?? "--"}
                            </p>
                        </>
                    )}
                    <p>
                        <span className="font-medium">Total:</span> A${parseFloat(tempBooking?.total_price || "0").toFixed(2)}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={() => router.push("/")}
                        className="flex-1 py-3 font-semibold rounded-lg transition"
                    >
                        Back to Home
                    </Button>
                    <Button
                        onClick={() => router.push("/user/bookings")}
                        className="flex-1 py-3 font-semibold rounded-lg transition"
                        variant="secondary"
                    >
                        View My Bookings
                    </Button>
                </div>
            </div>
        </main>
    );
}

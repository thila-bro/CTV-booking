"use client";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const spaceName = searchParams?.get("spaceName") || "Modern Coworking Hub";
    const date = searchParams?.get("date") || "Not selected";
    const startTime = searchParams?.get("startTime") || "--";
    const endTime = searchParams?.get("endTime") || "--";
    const totalPrice = searchParams?.get("totalPrice") || "--";

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
                        <span className="font-medium">Space:</span> {spaceName}
                    </p>
                    <p>
                        <span className="font-medium">Date:</span> {date}
                    </p>
                    <p>
                        <span className="font-medium">Time:</span> {startTime} - {endTime}
                    </p>
                    <p>
                        <span className="font-medium">Total:</span> A${parseFloat(totalPrice).toFixed(2)}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => router.push("/user/bookings")}
                        className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        </main>
    );
}

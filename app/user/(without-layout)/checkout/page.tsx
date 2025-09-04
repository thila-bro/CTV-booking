"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function CheckoutPage() {
    const currentDate = new Date();
    const currentTime = new Date().toLocaleTimeString();
    const pickerStartDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const pickerEndDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    const defaultEndDate = new Date(currentDate.getTime() + 30 * 60 * 1000);
    const maxPickerDate = new Date(currentDate.getTime() + 21 * 24 * 60 * 60 * 1000);





    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [totalPrice, setTotalPrice] = useState(0);

    const pricePerHour = 20; // 💰 Change this value as needed

    // Calculate price whenever dates change
    useEffect(() => {
        if (startDate && endDate) {
            const diffMs = endDate - startDate; // difference in ms
            const diffHrs = diffMs / (1000 * 60 * 60); // convert ms to hours
            if (diffHrs >= 0.5) {
                setTotalPrice(diffHrs * pricePerHour);
            } else {
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate]);

    // Prevent booking if duration < 30 mins
    const handleCheckout = () => {
        if (!endDate || endDate - startDate < 30 * 60 * 1000) {
            alert("Minimum booking is 30 minutes.");
            return;
        }
        // ✅ Redirect to success page (you can integrate payment gateway here)
        window.location.href = "success";
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
                    Checkout
                </h1>

                {/* Space Details */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Modern Coworking Hub</h2>
                    <p className="text-gray-600">Downtown • ${pricePerHour}/hr</p>
                </div>

                {/* Date & Time Picker */}
                <div className="grid gap-6 mb-8">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Start Date & Time
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            timeIntervals={30} // ⏰ Only allow 30-min steps
                            dateFormat="Pp"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            End Date & Time
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            showTimeSelect
                            timeIntervals={30} // ⏰ Only allow 30-min steps
                            // minDate={startDate}
                            // minTime={startDate}
                            // maxDate={maxPickerDate}
                            // maxTime={maxPickerDate}
                            // disabled={startDate === null}
                            dateFormat="Pp"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            icon={<AtSymbolIcon />}
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Booking Summary</h3>
                    <p>
                        <span className="font-medium">Start:</span>{" "}
                        {/* {startDate ? startDate.toLocaleString() : "Not selected"} */}
                        {mounted && startDate ? startDate.toLocaleString() : "Not selected"}
                    </p>
                    <p>
                        <span className="font-medium">End:</span>{" "}
                        {/* {endDate ? endDate.toLocaleString() : "Not selected"} */}
                        {mounted && endDate ? endDate.toLocaleString() : "Not selected"}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-indigo-600">
                        Total Price:{" "}
                        {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "—"}
                    </p>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                >
                    Confirm & Proceed to Payment
                </button>
            </div>
        </main>
    );
}

"use client";

import { useEffect, useState } from "react";
// import { getUserBookings } from "@/repositories/booking";
import { getUserBookings } from "./action";
import { get } from "http";

export default function Page() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // async function fetchBookings() {
        //     setLoading(true);
        //     const data = await getUserBookings();
        //     setBookings(data || []);
        //     setLoading(false);
        // }
        // fetchBookings();
        getUserBookings().then((data) => {
            setBookings(data || []);
            setLoading(false);
            console.log("Fetched bookings:", data);
        });
    }, []);

    if (loading) {
        return <div className="p-8 ">Loading your bookings...</div>;
    }

    if (!bookings.length) {
        return <div className="p-8 ">No bookings found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Space</th>
                            <th className="py-2 px-4 text-left">Type</th>
                            <th className="py-2 px-4 text-left">Date/Range</th>
                            <th className="py-2 px-4 text-left">Details</th>
                            <th className="py-2 px-4 text-left">Total</th>
                            <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b">
                                <td className="py-2 px-4">{booking.space?.name || "Space"}</td>
                                <td className="py-2 px-4 capitalize">{booking.type}</td>
                                <td className="py-2 px-4">
                                    {booking.type === "hourly" && booking.date}
                                    {booking.type === "daily" && `${booking.start_date} - ${booking.end_date}`}
                                    {booking.type === "monthly" && `${booking.month_start} - ${booking.month_end}`}
                                </td>
                                <td className="py-2 px-4 text-sm">
                                    {booking.type === "hour" && (
                                        <>
                                            {booking.start_time} - {booking.end_time}
                                        </>
                                    )}
                                    {booking.type === "day" && (
                                        <>
                                            Active Weekdays: {booking.duration}
                                        </>
                                    )}
                                    {booking.type === "month" && (
                                        <>
                                            Months: {booking.duration}
                                        </>
                                    )}
                                </td>
                                <td className="py-2 px-4">A${parseFloat(booking.total_price).toFixed(2)}</td>
                                <td className="py-2 px-4">{booking.payment_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
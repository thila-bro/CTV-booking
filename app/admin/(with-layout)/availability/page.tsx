'use client';

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getAvailabilityData } from "./action";


export default function AvailabilityPage() {
    const [availability, setAvailability] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Handler for date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value));
    };

    useEffect(() => {
        if (!selectedDate) {
            setAvailability([]);
            return;
        }
        setLoading(true);
        
        getAvailabilityData(selectedDate).then((data) => {
            if (data) {
                setAvailability(data);
            }
        });
        setLoading(false); // Remove this when using real data
    }, [selectedDate]);

    return (
        <div className="max-w-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Space Availability by Date</h2>
            <div className="mb-6 flex items-center gap-4">
                <label htmlFor="date" className="font-medium">Pick a date:</label>
                <Input
                    type="date"
                    id="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="w-48"
                />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left">Space</th>
                                <th className="py-2 px-4 text-left">Start Time</th>
                                <th className="py-2 px-4 text-left">End Time</th>
                                <th className="py-2 px-4 text-left">Type</th>
                                <th className="py-2 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availability.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-4 text-center text-gray-500">
                                        {selectedDate
                                            ? "No spaces reserved for this date."
                                            : "Please pick a date."}
                                    </td>
                                </tr>
                            ) : (
                                availability.map((a) => (
                                    <tr key={a.id} className="border-b">
                                        <td className="py-2 px-4">{a.space?.name || a.space_id}</td>
                                        <td className="py-2 px-4">{a.start_time}</td>
                                        <td className="py-2 px-4">{a.end_time}</td>
                                        <td className="py-2 px-4 capitalize">{a.type}</td>
                                        <td className="py-2 px-4">{a.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
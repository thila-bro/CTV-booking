'use client';

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getAvailabilityData } from "./action";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { format, set } from "date-fns";



export default function AvailabilityPage() {
    const [availability, setAvailability] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [open, setOpen] = useState(false);

    // Handler for date change
    // const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelectedDate(new Date(e.target.value));
    // };

    useEffect(() => {
        if (!selectedDate) {
            setAvailability([]);
            return;
        }
        setLoading(true);
        getAvailabilityData(format(selectedDate, "yyyy-MM-dd")).then((data) => {
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
                {/* <Input
                    type="date"
                    id="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="w-48"
                /> */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="justify-between font-normal"
                        >
                            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                            {/* <ChevronDownIcon /> */}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate || undefined}
                            captionLayout="dropdown"
                            onSelect={(d) => {
                                setSelectedDate(d || new Date());
                                setOpen(false);
                            }}
                        // disabled={(d) =>
                        //     d < pickerStartDate ||
                        //     d > maxPickerDate ||
                        //     d.getDay() === 0 ||
                        //     d.getDay() === 6
                        // }
                        />
                    </PopoverContent>
                </Popover>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left">Space</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Start Time</th>
                                <th className="py-2 px-4 text-left">End Time</th>
                                <th className="py-2 px-4 text-left">Type</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Customer</th>
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
                                        <td className="py-2 px-4">
                                            {a.space.name}
                                        </td>
                                        <td className="py-2 px-4">{format(a.date, "PPP")}</td>
                                        <td className="py-2 px-4">{a.start_time}</td>
                                        <td className="py-2 px-4">{a.end_time}</td>
                                        <td className="py-2 px-4 capitalize">{a.type}</td>
                                        <td className="py-2 px-4">{a.status}</td>
                                        <td className="py-2 px-4">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <button className="text-blue-500">{a.user.first_name} {a.user.last_name}</button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        <h3 className="font-bold">{a.user.first_name} {a.user.last_name}</h3>
                                                        <a href={`mailto:${a.user.email}`}>Email: {a.user.email}</a> <br />
                                                        <a href={`tel:${a.user.mobile}`}>Phone: {a.user.mobile}</a>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </td>
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
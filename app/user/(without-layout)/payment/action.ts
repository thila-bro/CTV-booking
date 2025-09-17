
'use server';

import { getTempBookingByIdRepo } from "@/repositories/temp-booking";
import { addHourBooking, addDayBooking, addMonthBooking } from "@/repositories/booking";
import { addBulkAvailability, addDayBookingAvailability } from "@/repositories/availability";
import { addDays, isSaturday, isSunday } from "date-fns";
import { constructFromSymbol } from "date-fns/constants";
import { getActiveWeekdaysInRange } from "@/lib/global";


export async function paymentSuccessAction(preBookingId: string, responseData: any) {
    const preBookingData = await getTempBookingByIdRepo(preBookingId);

    if (!preBookingData) {
        throw new Error("Pre-booking not found");
    }

    switch (preBookingData.type) {
        case "hour":
            await addHourBooking({
                user_id: preBookingData.user_id,
                space_id: preBookingData.space_id,
                date: preBookingData.date,
                start_time: preBookingData.start_time,
                end_time: preBookingData.end_time,
                duration: preBookingData.duration,
                total_price: preBookingData.total_price,
                type: preBookingData.type,
                payment_reference: responseData.id,
                payment_response: responseData,
                payment_status: "paid"
            });

            await addDayBookingAvailability({
                spaceId: preBookingData.space_id,
                date: preBookingData.date,
                startTime: preBookingData.start_time,
                endTime: preBookingData.end_time,
                type: preBookingData.type
            });
        case "day":
            await addDayBooking({
                user_id: preBookingData.user_id,
                space_id: preBookingData.space_id,
                start_date: preBookingData.start_date,
                end_date: preBookingData.end_date,
                duration: preBookingData.duration,
                total_price: preBookingData.total_price,
                type: preBookingData.type,
                payment_reference: responseData.id,
                payment_response: responseData,
                payment_status: "paid"
            });

            const dates = getActiveWeekdaysInRange(new Date(preBookingData.start_date), new Date(preBookingData.end_date));
            const availabilities = dates.map(date => ({
                space_id: preBookingData.space_id,
                date,
                start_time: "00:00",
                end_time: "23:59",
                type: preBookingData.type
            }));
            await addBulkAvailability(availabilities);
        case "month":
            await addMonthBooking({
                user_id: preBookingData.user_id,
                space_id: preBookingData.space_id,
                start_date: preBookingData.start_date,
                end_date: preBookingData.end_date,
                duration: preBookingData.duration,
                total_price: preBookingData.total_price,
                type: preBookingData.type,
                payment_reference: responseData.id,
                payment_response: responseData,
                payment_status: "paid"
            });

            const monthDates = getActiveWeekdaysInRange(new Date(preBookingData.start_date), new Date(preBookingData.end_date));
            const monthAvailabilities = monthDates.map(date => ({
                space_id: preBookingData.space_id,
                date,
                start_time: "00:00",
                end_time: "23:59",
                type: preBookingData.type
            }));
            await addBulkAvailability(monthAvailabilities);
    }
}
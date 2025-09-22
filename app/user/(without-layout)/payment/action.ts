
'use server';

import { getTempBookingByIdRepo } from "@/repositories/temp-booking";
import { addHourBooking, addDayBooking, addMonthBooking } from "@/repositories/booking";
import { addBulkAvailability, addDayBookingAvailability } from "@/repositories/availability";
import { getActiveWeekdaysInRange } from "@/lib/global";


export async function paymentSuccessAction(preBookingId: string, responseData: any) {
    const preBookingData = await getTempBookingByIdRepo(preBookingId);

    if (!preBookingData) {
        // throw new Error("Pre-booking not found");
        console.error("Pre-booking not found");
        return;
    }

    switch (preBookingData.type) {
        case "hour":
            const hourBooking = await addHourBooking({
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
                bookingId: hourBooking.db.id,
                date: preBookingData.date,
                startTime: preBookingData.start_time,
                endTime: preBookingData.end_time,
                type: preBookingData.type
            });
            break;
        case "day":
            const dayBooking = await addDayBooking({
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
                booking_id: dayBooking.db.id,
                date,
                start_time: "00:00",
                end_time: "23:59",
                type: preBookingData.type
            }));
            await addBulkAvailability(availabilities);
            break;
        case "month":
            const monthBooking = await addMonthBooking({
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
                booking_id: monthBooking.db.id,
                date,
                start_time: "00:00",
                end_time: "23:59",
                type: preBookingData.type
            }));
            await addBulkAvailability(monthAvailabilities);
            break;
    }
}
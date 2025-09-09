
'use server';

import { getTempBookingByIdRepo } from "@/repositories/temp-booking";
import { saveBookingRepo } from "@/repositories/booking";

export async function paymentSuccessAction(preBookingId: string, responseData: any) {
    const preBookingData = await getTempBookingByIdRepo(preBookingId);

    if (!preBookingData) {
        throw new Error("Pre-booking not found");
    }

    const bookingData = {
        user_id: preBookingData.user_id,
        space_id: preBookingData.space_id,
        date: preBookingData.date,
        start_time: preBookingData.start_time,
        end_time: preBookingData.end_time,
        duration: preBookingData.duration,
        total_price: preBookingData.total_price,
        payment_reference: responseData.id,
        payment_response: responseData
    };

    const savedBooking = await saveBookingRepo(bookingData);
}
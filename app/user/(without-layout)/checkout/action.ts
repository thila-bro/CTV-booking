'use server';

import { checkSpaceAvailabilityByDateAndTimeRepo } from "@/repositories/booking";
import { findSpaceByIdRepo } from "@/repositories/spaces";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { userSessionCookieName } from "@/lib/constant";
import { TempBookingSchema } from "@/models/tempBooking";
import { formatTime } from "@/lib/global";
import { addTempBookingRepo } from "@/repositories/temp-booking";


export async function checkSpaceAvailability(prevState: any, formData: FormData) {
    const date = formData.get("date") as string;
    const startTime = formData.get("start_time") as string;
    const endTime = formData.get("end_time") as string;
    const spaceId = formData.get("spaceId");
    const totalPrice = formData.get("totalPrice");

    // Check if all required fields are present
    const UserCookie = (await cookies()).get(userSessionCookieName)?.value;
    const UserSession = await decrypt(UserCookie);

    if (!UserSession?.userId) {
        return {
            message: "User not logged in. Please login.",
            success: false
        }
    }

    // Check if spceId is valid
    const space = await findSpaceByIdRepo(spaceId as string);
    if (!space) {
        return {
            message: "Something went wrong. Please try again.",
            success: false
        }
    }

    const validationResult = TempBookingSchema.safeParse({
        start_time: formData.get("start_time"),
        end_time: formData.get("end_time"),
        date: formData.get("date")
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors,
            data: Object.fromEntries(formData)
        };
    }

    // Validate available time range    
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    // Validate minimum duration
    if (end - start < 30) {
        return {
            message: "Minimum booking duration is 30 minutes.",
            success: false
        }
    }

    // Validate available time range
    if (space) {
        const [availStartH, availStartM] = space.start_time.split(":").map(Number);
        const [availEndH, availEndM] = space.end_time.split(":").map(Number);
        const availStart = availStartH * 60 + availStartM;
        const availEnd = availEndH * 60 + availEndM;
        if (start < availStart || end > availEnd) {
            // alert(`Selected time is out of available range (${space.start_time} - ${space.end_time}).`);
            // return;
            return {
                message: `Selected time is out of available range (${formatTime(space.start_time)} - ${formatTime(space.end_time)}).`,
                success: false
            }
        }
    }

    // check if space is available for the selected time range
    const bookings = await checkSpaceAvailabilityByDateAndTimeRepo(spaceId as string, date, startTime, endTime);
    if (bookings.length > 0) {
        // console.log("bookings", bookings);
        return {
            message: "Sorry, the space is already booked for the selected time. Please choose a different time.",
            success: false
        }
    }

    // All validations passed, create a temporary booking
    const tempBooking = await addTempBookingRepo({
        user_id: UserSession.userId,
        space_id: spaceId,
        date,
        start_time: startTime,
        end_time: endTime,
        duration: end - start,
        total_price: totalPrice,
    });

    if (!tempBooking) {
        return {
            message: "Something went wrong. Try again."
        };
    }

    return {
        message: "Booking details saved. Proceeding to payment.",
        success: true,
        db: tempBooking
    };
}
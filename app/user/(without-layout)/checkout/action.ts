'use server';

import { checkSpaceAvailabilityByDateAndTimeRepo, checkSpaceAvailabilityByDateAndTimeRangeRepo } from "@/repositories/availability";
import { findSpaceByIdRepo } from "@/repositories/spaces";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { userSessionCookieName } from "@/lib/constant";
import { TempBookingDaySchema, TempBookingHourSchema, TempBookingMonthSchema } from "@/models/tempBooking";
import { countActiveWeekdays, formatTime } from "@/lib/global";
import { addTempHrBookingRepo, addTempDayBookingRepo, addTempMonthBookingRepo } from "@/repositories/temp-booking";


export async function checkSpaceAvailability(prevState: any, formData: FormData) {
    
    const bookingType = formData.get("bookingType");
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

    switch (bookingType) {
        case "hour":
            const validationResult = TempBookingHourSchema.safeParse({
                start_time: formData.get("start_time"),
                end_time: formData.get("end_time"),
                date: formData.get("date")
            });

            if (!validationResult.success) {
                console.log("validationResult", validationResult.error.flatten());
                return {
                    errors: validationResult.error.flatten().fieldErrors,
                    data: Object.fromEntries(formData)
                };
            }

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

            // Check if space is available for the selected date and time
            const availabilities = await checkSpaceAvailabilityByDateAndTimeRepo(spaceId as string, date, startTime, endTime);
            if (availabilities.length > 0) {
                return {
                    message: "Space is not available for the selected date and time.",
                    success: false
                };
            }
            
            const tempBooking = await addTempHrBookingRepo({
                user_id: UserSession.userId,
                space_id: spaceId,
                date,
                start_time: startTime,
                end_time: endTime,
                duration: end - start,
                total_price: totalPrice,
                type: bookingType
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
        case "day":
            const dayValidationResult = TempBookingDaySchema.safeParse({
                start_date: formData.get("start_date"),
                end_date: formData.get("end_date"),
                num_days: formData.get("num_days")
            });

            if (!dayValidationResult.success) {
                return {
                    errors: dayValidationResult.error.flatten().fieldErrors,
                    data: Object.fromEntries(formData)
                };
            }

            // check if space is available for the selected date range
            const dayAvailabilities = await checkSpaceAvailabilityByDateAndTimeRangeRepo(spaceId as string, formData.get("start_date") as string, formData.get("end_date") as string);
            if (dayAvailabilities.length > 0) {
                return {
                    message: "Space is not available for the selected date and time.",
                    success: false
                };
            }

            const tempDayBooking = await addTempDayBookingRepo({
                user_id: UserSession.userId,
                space_id: spaceId,
                start_date: formData.get("start_date") as string,
                end_date: formData.get("end_date") as string,
                duration: countActiveWeekdays(new Date(formData.get("start_date") as string), new Date(formData.get("end_date") as string)),
                total_price: totalPrice,
                type: bookingType
            });
            

            if (!tempDayBooking) {
                return {
                    message: "Something went wrong. Try again."
                };
            }

            return {
                message: "Booking details saved. Proceeding to payment.",
                success: true,
                db: tempDayBooking
            };
        case "month":
            const monthValidationResult = TempBookingMonthSchema.safeParse({
                start_date: formData.get("start_month"),
                end_date: formData.get("end_month"),
                num_months: formData.get("num_months")
            });

            if (!monthValidationResult.success) {
                return {
                    message: "Invalid selection.",
                    errors: monthValidationResult.error.flatten().fieldErrors,
                    data: Object.fromEntries(formData)
                };
            }

            // check if space is available for the selected date range

            const tempMonthBooking = await addTempMonthBookingRepo({
                user_id: UserSession.userId,
                space_id: spaceId,
                start_date: formData.get("start_month") as string,
                end_date: formData.get("end_month") as string,
                duration: formData.get("num_months") as unknown as number,
                total_price: totalPrice,
                type: bookingType
            });

            if (!tempMonthBooking) {
                return {
                    message: "Something went wrong. Try again."
                };
            }

            return {
                message: "Booking details saved. Proceeding to payment.",
                success: true,
                db: tempMonthBooking
            };
    }

    return {
        message: "Something went wrong. Try again."
    };
}
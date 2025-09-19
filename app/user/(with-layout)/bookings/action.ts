'use server';

import { userSessionCookieName } from "@/lib/constant";
import { decrypt } from "@/lib/session";
import { getBookingByUserId } from "@/repositories/booking";
import { cookies } from "next/headers";



export async function getUserBookings() {
    const cookieValue = (await cookies()).get(userSessionCookieName)?.value;
    const sessionPayload = await decrypt(cookieValue);

    return await getBookingByUserId(sessionPayload?.userId as string);
}

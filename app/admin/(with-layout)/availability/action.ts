'use server';
import { getAvailabilityByDate } from "@/repositories/availability";

export async function getAvailabilityData(date: string) {
    console.log("Getting availability for date:", date);
    return await getAvailabilityByDate(date);
}
'use server';
import { getAvailabilityByDate } from "@/repositories/availability";

export async function getAvailabilityData(date: Date) {
    return await getAvailabilityByDate(date);
}
import { z } from "zod";

export const TempBookingHourSchema = z.object({
    start_time: z.preprocess((val) => String(val), z.string().min(1, { message: "Start time is required" })),
    end_time: z.preprocess((val) => String(val), z.string().min(1, { message: "End time is required" })),
    date: z.preprocess((val) => String(val), z.string().min(1, { message: "Date is required" })),
});

export const TempBookingDaySchema = z.object({
    start_date: z.preprocess((val) => String(val), z.string().min(1, { message: "Start date is required" })),
    end_date: z.preprocess((val) => String(val), z.string().min(1, { message: "End date is required" })),
});

export const TempBookingMonthSchema = z.object({
    start_month: z.preprocess((val) => String(val), z.string().min(1, { message: "Start month is required" })),
    end_month: z.preprocess((val) => String(val), z.string().min(1, { message: "End month is required" })),
    num_months: z.preprocess((val) => Number(val), z.number().min(1, { message: "Number of months must be at least 1" }).max(12, { message: "Number of months cannot exceed 24" })),
});
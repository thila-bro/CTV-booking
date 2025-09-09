import { z } from "zod";

export const TempBookingSchema = z.object({
    start_time: z.preprocess((val) => String(val), z.string().min(1, { message: "Start time is required" })),
    end_time: z.preprocess((val) => String(val), z.string().min(1, { message: "End time is required" })),
    date: z.preprocess((val) => String(val), z.string().min(1, { message: "Date is required" })),
});
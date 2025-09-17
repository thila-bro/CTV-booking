import { z } from "zod";

export const SpaceSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    // price: z.preprocess((val) => Number(val), z.number({ invalid_type_error: "Price must be a number" }).min(0, { message: "Price must be at least 0" }).max(100, { message: "Price must be at most 100" })),
    images: z.preprocess(
        (val) => Array.isArray(val) ? val : [val],
        z.array(z.instanceof(File)).min(1, { message: "At least one image is required" })
    ),
    start_time: z.preprocess((val) => String(val), z.string().min(1, { message: "Start time is required" })),
    end_time: z.preprocess((val) => String(val), z.string().min(1, { message: "End time is required" })),
    price_per_hr: z.preprocess((val) => val === null || val === undefined || val === '' ? null : Number(val), z.number({ invalid_type_error: "Price per hour must be a number" }).min(0, { message: "Price per hour must be at least 0" }).max(999, { message: "Price per hour must be at most 999" }).nullable()),
    price_per_day: z.preprocess((val) => val === null || val === undefined || val === '' ? null : Number(val), z.number({ invalid_type_error: "Price per day must be a number" }).min(0, { message: "Price per day must be at least 0" }).max(99999, { message: "Price per day must be at most 99999" }).nullable()),
    price_per_month: z.preprocess((val) => val === null || val === undefined || val === '' ? null : Number(val), z.number({ invalid_type_error: "Price per month must be a number" }).min(0, { message: "Price per month must be at least 0" }).max(999999, { message: "Price per month must be at most 999999" }).nullable()),
});
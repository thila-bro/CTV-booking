import { z } from "zod";

export const SpaceSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    price: z.preprocess((val) => Number(val), z.number({ invalid_type_error: "Price must be a number" }).min(0, { message: "Price must be at least 0" }).max(100, { message: "Price must be at most 100" })),
    images: z.preprocess(
        (val) => Array.isArray(val) ? val : [val],
        z.array(z.instanceof(File)).min(1, { message: "At least one image is required" })
    ),
});
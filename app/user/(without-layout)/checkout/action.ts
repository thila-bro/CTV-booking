import { addTempBookingRepo } from "@/repositories/temp-booking";
import { findSpaceByIdRepo } from "@/repositories/spaces";

export async function checkSpaceAvailability(prevState: any, formData: FormData) {
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const duration = formData.get("duration") as string;
    const totalPrice = formData.get("totalPrice") as string;

    console.log("Checking availability for:", { date, startTime, endTime, duration, totalPrice });


    // const space = await findSpaceByIdRepo(prevState.spaceId);
    // // Validate available time range
    // if (space) {
    //     const [availStartH, availStartM] = space.start_time.split(":").map(Number);
    //     const [availEndH, availEndM] = space.end_time.split(":").map(Number);
    //     const availStart = availStartH * 60 + availStartM;
    //     const availEnd = availEndH * 60 + availEndM;
    //     if (startTime < availStart || endTime > availEnd) {
    //         // alert(`Selected time is out of available range (${space.start_time} - ${space.end_time}).`);
    //         // return;
    //         console.error(`Selected time is out of available range (${space.start_time} - ${space.end_time}).`);
    //     }
    // }

}
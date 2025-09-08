export function formatTimeHM(timeStr: string) {
    const [hour, minute] = timeStr.split(":").map(Number);
    // Return time in 24-hour format (HH:mm)
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}
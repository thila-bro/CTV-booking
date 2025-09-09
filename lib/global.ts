export function formatTime(timeStr: string) {
    const [hour, minute] = timeStr.split(":").map(Number);
    // Return time in 24-hour format (HH:mm)
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

// get current date in YYYY-MM-DD format
export function dateFormat(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}
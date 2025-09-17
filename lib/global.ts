import { addDays } from "date-fns/addDays";

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

// count active (weekday) days (Mon-Fri) inclusive
export function countActiveWeekdays(start: Date, end: Date) {
    if (!start || !end) return 0;
    if (end < start) return 0;
    let count = 0;
    let cursor = new Date(start);
    while (cursor <= end) {
        const day = cursor.getDay(); // 0 Sun, 6 Sat
        if (day !== 0 && day !== 6) count++;
        cursor.setDate(cursor.getDate() + 1);
    }
    return count;
}

// Create array of active weekdays between start_date and end_date
export function getActiveWeekdaysInRange(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    let cursor = new Date(start);
    while (cursor <= end) {
        const day = cursor.getDay();
        if (day !== 0 && day !== 6) { // Not Sunday or Saturday
            dates.push(cursor.toISOString().slice(0, 10)); // "YYYY-MM-DD"
        }
        cursor = addDays(cursor, 1);
    }
    return dates;
}
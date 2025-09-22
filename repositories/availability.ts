import { sql } from "@/lib/pgsqlConnector";

export async function addDayBookingAvailability(available: any) {
    const [insertAvailability] = await sql`INSERT INTO availability (space_id, booking_id, date, start_time, end_time, type)
               VALUES (${available.spaceId}, ${available.bookingId}, ${available.date}, ${available.startTime}, ${available.endTime}, ${available.type})
               RETURNING id;`;
    return insertAvailability;
}

export async function addBulkAvailability(availabilities: any[]) {
    if (!availabilities.length) return;

    // Prepare array of arrays for parameterized query
    const values = availabilities.map(avail => [
        avail.space_id,
        avail.booking_id,
        avail.date,
        avail.start_time,
        avail.end_time,
        avail.type
    ]);

    // Use parameterized bulk insert
    const insertedAvailabilities = await sql`
        INSERT INTO availability (space_id, booking_id, date, start_time, end_time, type)
        VALUES ${sql(values)}
        RETURNING id;
    `;
    return insertedAvailabilities;
} 

export async function checkSpaceAvailabilityByDateAndTimeRepo(spaceId: string, date: string, startTime: string, endTime: string) {
    const bookings = await sql`SELECT * FROM availability WHERE (space_id = ${spaceId} AND date = CAST(${date} AS DATE)) AND ((start_time, end_time) OVERLAPS (CAST(${startTime} AS TIME), CAST(${endTime} AS TIME))) ORDER BY start_time ASC`;
    return bookings;
}

export async function checkSpaceAvailabilityByDateAndTimeRangeRepo(spaceId: string, startDate: string, endDate: string) {
    const bookings = await sql`SELECT * FROM availability WHERE (space_id = ${spaceId}) AND (date BETWEEN CAST(${startDate} AS DATE) AND CAST(${endDate} AS DATE)) ORDER BY date ASC, start_time ASC`;
    return bookings;
}

export async function getAvailabilityByDate(date: Date) {
    const availability = await sql`
    SELECT a.*, 
    row_to_json(b) AS booking,
    row_to_json(u) AS user,
    row_to_json(s) AS space
    FROM availability a
    LEFT JOIN bookings b ON a.booking_id = b.id
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN spaces s ON a.space_id = s.id WHERE a.date = CAST(${date} AS DATE)
    ORDER BY a.created_at ASC`;
    return availability;
}
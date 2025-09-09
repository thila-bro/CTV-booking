import { sql } from "@/lib/pgsqlConnector";


export async function saveBookingRepo(booking: any) {
    const [insertBooking] = await sql`
        INSERT INTO bookings (id, user_id, space_id, date, start_time, end_time, duration, total_price, payment_reference, payment_response)
        VALUES (${crypto.randomUUID()}, ${booking.user_id}, ${booking.space_id}, CAST(${booking.date} AS DATE), CAST(${booking.start_time} AS TIME), CAST(${booking.end_time} AS TIME), ${booking.duration}, ${booking.total_price}, ${booking.payment_reference}, ${booking.payment_response})
        RETURNING id;
    `;
    return { message: 'Booking saved successfully', db: insertBooking };
}

export async function checkSpaceAvailabilityByDateAndTimeRepo(spaceId: string, date: string, startTime: string, endTime: string) {
    const bookings = await sql`SELECT * FROM bookings WHERE (space_id = ${spaceId} AND date = CAST(${date} AS DATE)) AND ((start_time, end_time) OVERLAPS (CAST(${startTime} AS TIME), CAST(${endTime} AS TIME))) ORDER BY start_time ASC`;
    return bookings;
}
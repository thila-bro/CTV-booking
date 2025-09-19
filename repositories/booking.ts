import { sql } from "@/lib/pgsqlConnector";


export async function addHourBooking(booking: any) {
    const [insertBooking] = await sql`
        INSERT INTO bookings (id, user_id, space_id, date, start_time, end_time, duration, total_price, payment_reference, payment_response, type, payment_status)
        VALUES (${crypto.randomUUID()}, ${booking.user_id}, ${booking.space_id}, CAST(${booking.date} AS DATE), CAST(${booking.start_time} AS TIME), CAST(${booking.end_time} AS TIME), ${booking.duration}, ${booking.total_price}, ${booking.payment_reference}, ${booking.payment_response}, ${booking.type}, ${booking.payment_status})
        RETURNING id;
    `;
    return { message: 'Booking saved successfully', db: insertBooking };
}

export async function addDayBooking(booking: any) {
    const [insertBooking] = await sql`
        INSERT INTO bookings (id, user_id, space_id, start_date, end_date, duration, total_price, payment_reference, payment_response, type, payment_status)
        VALUES (${crypto.randomUUID()}, ${booking.user_id}, ${booking.space_id}, CAST(${booking.start_date} AS DATE), CAST(${booking.end_date} AS DATE), ${booking.duration}, ${booking.total_price}, ${booking.payment_reference}, ${booking.payment_response}, ${booking.type}, ${booking.payment_status})
        RETURNING id;
    `;
    return { message: 'Booking saved successfully', db: insertBooking };
}

export async function addMonthBooking(booking: any) {
    const [insertBooking] = await sql`
        INSERT INTO bookings (id, user_id, space_id, start_date, end_date, duration, total_price, payment_reference, payment_response, type, payment_status)
        VALUES (${crypto.randomUUID()}, ${booking.user_id}, ${booking.space_id}, CAST(${booking.start_date} AS DATE), CAST(${booking.end_date} AS DATE), ${booking.duration}, ${booking.total_price}, ${booking.payment_reference}, ${booking.payment_response}, ${booking.type}, ${booking.payment_status})
        RETURNING id;
    `;
    return { message: 'Booking saved successfully', db: insertBooking };
}

export async function getUserBookings(userId: string) {
    const bookings = await sql`SELECT * FROM bookings WHERE user_id = ${userId}`;
    return bookings;
}

export async function getBookingByUserId(userId: string) {
    const booking = await sql`SELECT * FROM bookings WHERE user_id = ${userId} ORDER BY created_at DESC `;
    return booking;
}
import { sql } from '@/lib/pgsqlConnector';

export async function addTempBookingRepo(tempBooking: any) {
    const [insertTempBooking] = await sql`
        INSERT INTO temp_bookings (id, user_id, space_id, date, start_time, end_time, duration, total_price, payment_status)
        VALUES (${crypto.randomUUID()}, ${tempBooking.user_id}, ${tempBooking.space_id}, ${tempBooking.date}, ${tempBooking.start_time}, ${tempBooking.end_time}, ${tempBooking.duration}, ${tempBooking.total_price}, ${tempBooking.payment_status})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Temporary booking added successfully', db: insertTempBooking };
}
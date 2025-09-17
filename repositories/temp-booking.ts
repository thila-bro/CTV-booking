'use server';

import { sql } from '@/lib/pgsqlConnector';

export async function addTempHrBookingRepo(tempBooking: any) {
    const [insertTempBooking] = await sql`
        INSERT INTO temp_bookings (id, user_id, space_id, date, start_time, end_time, duration, total_price, type)
        VALUES (${crypto.randomUUID()}, ${tempBooking.user_id}, ${tempBooking.space_id}, CAST(${tempBooking.date} AS DATE), CAST(${tempBooking.start_time} AS TIME), CAST(${tempBooking.end_time} AS TIME), ${tempBooking.duration}, ${tempBooking.total_price}, ${tempBooking.type})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Temporary booking added successfully', db: insertTempBooking };
}

export async function addTempDayBookingRepo(tempBooking: any) {
    const [insertTempBooking] = await sql`
        INSERT INTO temp_bookings (id, user_id, space_id, start_date, end_date, duration, total_price, type)
        VALUES (${crypto.randomUUID()}, ${tempBooking.user_id}, ${tempBooking.space_id}, CAST(${tempBooking.start_date} AS DATE), CAST(${tempBooking.end_date} AS DATE), ${tempBooking.duration}, ${tempBooking.total_price}, ${tempBooking.type})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Temporary booking added successfully', db: insertTempBooking };
}

export async function addTempMonthBookingRepo(tempBooking: any) {
    const [insertTempBooking] = await sql`
        INSERT INTO temp_bookings (id, user_id, space_id, start_date, end_date, duration, total_price, type)
        VALUES (${crypto.randomUUID()}, ${tempBooking.user_id}, ${tempBooking.space_id}, CAST(${tempBooking.start_date} AS DATE), CAST(${tempBooking.end_date} AS DATE), ${tempBooking.duration}, ${tempBooking.total_price}, ${tempBooking.type})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
    `;
    return { message: 'Temporary booking added successfully', db: insertTempBooking };
}

export async function getTempBookingByIdWithUserNSpaceRepo(bookingId: string) {
    const [tempBooking] = await sql`
        SELECT 
            temp_bookings.id,
            temp_bookings.user_id,
            temp_bookings.space_id,
            temp_bookings.date,
            temp_bookings.start_time,
            temp_bookings.end_time,
            temp_bookings.start_date,
            temp_bookings.end_date,
            temp_bookings.duration,
            temp_bookings.total_price,
            temp_bookings.type,
            temp_bookings.payment_status,
            temp_bookings.created_at,
            temp_bookings.type,
            row_to_json(users) AS user,
            row_to_json(spaces) AS space,
            temp_bookings.created_at AS booking_created_at
        FROM temp_bookings
        JOIN users ON temp_bookings.user_id = users.id
        JOIN spaces ON temp_bookings.space_id = spaces.id
        WHERE temp_bookings.id = ${bookingId}
    `;
    return tempBooking;
}

export async function getTempBookingByIdRepo(bookingId: string) {
    const [tempBooking] = await sql`SELECT * FROM temp_bookings WHERE id = ${bookingId} `;
    return tempBooking;
}

export async function deleteTempBookingByIdRepo(bookingId: string) {
    const deleteTempBooking = await sql`
        DELETE FROM temp_bookings WHERE id = ${bookingId}
    `;
    return { message: 'Temporary booking deleted successfully', db: deleteTempBooking };
}
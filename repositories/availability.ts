import { sql } from "@/lib/pgsqlConnector";

export async function addDayBookingAvailability(available: any) {
    const [insertAvailability] = await sql`INSERT INTO availability (space_id, date, start_time, end_time, type)
               VALUES (${available.spaceId}, ${available.date}, ${available.startTime}, ${available.endTime}, ${available.type})
               RETURNING id;`;
    return insertAvailability;
}

export async function addBulkAvailability(availabilities: any[]) {
    if (!availabilities.length) return;

    // Prepare array of arrays for parameterized query
    const values = availabilities.map(avail => [
        avail.space_id,
        avail.date,
        avail.start_time,
        avail.end_time,
        avail.type
    ]);

    // Use parameterized bulk insert
    const insertedAvailabilities = await sql`
        INSERT INTO availability (space_id, date, start_time, end_time, type)
        VALUES ${sql(values)}
        RETURNING id;
    `;
    return insertedAvailabilities;
} 
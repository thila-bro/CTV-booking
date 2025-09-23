import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, Admin } from '../lib/placeholder-data';
import { se } from 'date-fns/locale';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const sql = postgres(process.env.POSTGRES_URL!, { ssl: false }); // ssl should be true for live, false for local dev

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      mobile VARCHAR(15) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // const insertedUsers = await Promise.all(
  //   users.map(async (user) => {
  //     const hashedPassword = await bcrypt.hash(user.password, 10);
  //     return sql`
  //       INSERT INTO users (id, name, email, password)
  //       VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
  //       ON CONFLICT (id) DO NOTHING;
  //     `;
  //   }),
  // );

  // return insertedUsers;
}

async function seedAdmins() {
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,      
      is_superadmin BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedAdmins = await Promise.all(
    Admin.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO admins (id, name, email, password, is_superadmin)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.is_superadmin})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedAdmins;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedSpaces() {
  await sql`
    CREATE TABLE IF NOT EXISTS spaces (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      price_per_hr INT,
      price_per_day INT,
      price_per_month INT,
      is_price_per_hr_enabled BOOLEAN DEFAULT FALSE,
      is_price_per_day_enabled BOOLEAN DEFAULT FALSE,
      is_price_per_month_enabled BOOLEAN DEFAULT FALSE,
      is_available BOOLEAN DEFAULT TRUE,      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedSpaceImages() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; // Ensure the extension is created

  await sql`
    CREATE TABLE IF NOT EXISTS space_images (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      space_id UUID REFERENCES spaces(id),
      image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedTempBookings() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; // Ensure the extension is created

  await sql`CREATE TABLE IF NOT EXISTS temp_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    space_id UUID REFERENCES spaces(id),
    date DATE,
    start_time TIME,
    end_time TIME,
    start_date DATE,
    end_date DATE,
    duration INT NOT NULL,
    total_price INT NOT NULL,
    type booking_type NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
}

async function seedAvailability() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; // Ensure the extension is created

  await sql`
    CREATE TABLE IF NOT EXISTS availability (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      space_id UUID REFERENCES spaces(id),
      booking_id UUID REFERENCES bookings(id),
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      type booking_type NOT NULL,
      status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedBookings() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`  CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    space_id UUID REFERENCES spaces(id),
    date DATE,
    start_time TIME,
    end_time TIME,
    start_date DATE,
    end_date DATE,
    duration INT NOT NULL,
    total_price INT NOT NULL,
    type booking_type NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    payment_reference VARCHAR(255) NOT NULL,
    payment_response JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
}

async function seedCategories() {
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
        CREATE TYPE booking_type AS ENUM ('hour', 'day', 'month');
      END IF;
    END
    $$;
  `;
}

export async function GET() {
  try {
    const result = await sql.begin(async (sql) => [
      await seedCategories(),
      await seedSpaces(),
      await seedUsers(),
      await seedBookings(),
      seedSpaceImages(),
      seedTempBookings(),
      seedAvailability(),
      seedAdmins(),



      // seedBookings(),
      // seedCustomers(),
      // seedInvoices(),
      // seedRevenue(),
      // seedSpaces(),
      // seedSpaceImages(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

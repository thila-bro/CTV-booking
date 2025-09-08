import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, Admin } from '../lib/placeholder-data';

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

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedAdmins() {
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedAdmins = await Promise.all(
    Admin.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO admins (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
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
      price INT NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
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
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INT NOT NULL,
    total_price INT NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
}

async function seedBookings() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; // Ensure the extension is created

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      space_id UUID REFERENCES spaces(id),
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      duration INT NOT NULL,
      total_price INT NOT NULL,      
      status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}


export async function GET() {
  try {
    const result = await sql.begin(async (sql) => [
      await seedSpaces(),
      seedSpaceImages(),
      seedUsers(),
      seedAdmins(),
      seedTempBookings(),
      seedBookings(),
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

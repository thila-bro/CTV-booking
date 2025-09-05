
import { sql } from '@/lib/pgsqlConnector';

async function seedSpaces() {
  // Create table
  await sql`
    CREATE TABLE IF NOT EXISTS spaces (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedSpaceImages() {
  await sql`
    CREATE TABLE IF NOT EXISTS space_images (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      space_id UUID REFERENCES spaces(id),
      image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

}

// In your GET handler:
export async function GET() {
  try {
    const spaceIds = await seedSpaces();
    await seedSpaceImages();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
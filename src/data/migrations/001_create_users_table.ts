import { SQL } from "bun";

export async function up(db:SQL) {
  await db`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `;
}

export async function down(db:SQL) {
  await db`DROP TABLE IF EXISTS users`;
}
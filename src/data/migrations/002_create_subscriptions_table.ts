import { SQL } from "bun";

export async function up(db: SQL) {
  await db`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      interval INTEGER NOT NULL,
      last_checked TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;
}

export async function down(db: SQL) {
  await db`DROP TABLE IF EXISTS subscriptions`;
}
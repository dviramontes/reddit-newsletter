import { Pool } from "pg";

// TODO: load connStr from environment variable
const connectionString =
  "postgresql://postgres:postgres@10.254.254.254:5432/reddit-newsletter";

export const pool = new Pool({
  connectionString,
});

export async function pingDatabase() {
  const client = await pool.connect();
  const {
    rows: [{ now }],
  } = await client.query("SELECT NOW()");
  console.log(`-- established db connection: ${now}`);
  client.release();
}

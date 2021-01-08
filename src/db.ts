import { Pool } from "pg";

// TODO: load connStr from environment variable
const connectionString =
  "postgresql://postgres:postgres@10.254.254.254:5432/reddit-newsletter";

export const pool = new Pool({
  connectionString,
});

import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

let pool: Pool | null = null;

/** Connection pool for interactive Postgres transactions (e.g. license activation). */
export function getTransactionPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    neonConfig.webSocketConstructor = ws;
    pool = new Pool({ connectionString: databaseUrl });
  }

  return pool;
}

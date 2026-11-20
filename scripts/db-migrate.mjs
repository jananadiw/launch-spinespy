// Applies db/schema.sql to DATABASE_URL. Safe to re-run: every statement uses IF NOT EXISTS.
//   npm run db:migrate            (reads .env.local)
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Put it in .env.local or the environment.");
  process.exit(1);
}

const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
// Neon's HTTP driver runs one statement per query. The schema has no functions,
// so splitting on statement-ending semicolons is safe.
const statements = schema
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(/;\s*(?:\n|$)/)
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(url);
for (const statement of statements) {
  await sql.query(statement);
  console.log(`ok: ${statement.split("\n")[0]}`);
}
console.log(`Applied ${statements.length} statements.`);

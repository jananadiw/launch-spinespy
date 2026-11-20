import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { requireEnv } from "../config";

export type Row = Record<string, unknown>;

export interface Statement {
  text: string;
  params?: unknown[];
}

/** Minimal query surface the store needs. Neon in production, PGlite in tests. */
export interface Db {
  query(text: string, params?: unknown[]): Promise<Row[]>;
  /** Runs the statements in order in one non-interactive transaction. Returns each statement's rows. */
  transaction(statements: Statement[]): Promise<Row[][]>;
}

let sql: NeonQueryFunction<false, false> | null = null;
let sqlUrl: string | null = null;

/** Neon over HTTP: no sockets or pools to manage in serverless functions. */
export function getNeonDb(): Db {
  const url = requireEnv("DATABASE_URL");
  if (!sql || sqlUrl !== url) {
    sql = neon(url);
    sqlUrl = url;
  }
  const run = sql;
  return {
    query: (text, params = []) => run.query(text, params) as Promise<Row[]>,
    transaction: (statements) =>
      run.transaction(statements.map((s) => run.query(s.text, s.params ?? []))) as Promise<Row[][]>,
  };
}

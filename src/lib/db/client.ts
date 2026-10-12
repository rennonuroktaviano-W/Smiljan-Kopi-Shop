import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type DbClient = PgDatabase<PgQueryResultHKT, typeof schema>;

let cached: DbClient | null = null;
let pgliteClient: unknown | null = null;

/**
 * Mengembalikan klien basis data tunggal (di-cache per proses).
 *
 * - Jika `DATABASE_URL` (Neon) diisi → driver Neon HTTP (produksi/Vercel).
 * - Jika tidak, hanya di luar produksi → PGlite lokal (file di `PGLITE_DIR`).
 *
 * PGlite sengaja ditolak di produksi agar CMS tidak pernah diam-diam memakai
 * penyimpanan lokal yang tidak persisten pada deployment serverless.
 */
export async function getDb(): Promise<DbClient> {
  if (cached) return cached;

  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    cached = drizzle(neon(url), { schema }) as unknown as DbClient;
    return cached;
  }

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_DB !== "1") {
    throw new Error(
      "DATABASE_URL wajib diisi pada produksi. Setup Postgres (Neon) belum selesai."
    );
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { mkdirSync } = await import("node:fs");
  const dir = process.env.PGLITE_DIR?.trim() || "./.data/pglite";
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  pgliteClient = client;
  cached = drizzle(client, { schema }) as unknown as DbClient;
  return cached;
}

/** Klien PGlite mentah (untuk skrip migrasi lokal). Null bila memakai Neon. */
export function getPgliteClient(): unknown | null {
  return pgliteClient;
}

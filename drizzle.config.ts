import { defineConfig } from "drizzle-kit";

/**
 * Konfigurasi drizzle-kit untuk pembuatan migrasi dan penerapan ke Neon.
 * `drizzle-kit generate` tidak butuh koneksi basis data.
 * `npm run db:migrate` membaca DATABASE_URL (Neon) atau memakai PGlite lokal.
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://postgres:postgres@localhost:5432/smiljan",
  },
  strict: true,
  verbose: true,
});

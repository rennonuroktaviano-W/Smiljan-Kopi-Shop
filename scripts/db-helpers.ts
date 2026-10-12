import { config } from "dotenv";

// Muat konfigurasi lokal untuk skrip CLI (Next.js hanya memuat otomatis di runtime).
config({ path: ".env.local" });
config();

import { mkdirSync } from "node:fs";
import { eq } from "drizzle-orm";
import { PGlite } from "@electric-sql/pglite";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { migrate as migrateNeon } from "drizzle-orm/neon-http/migrator";
import { users, type NewUser, type UserRow } from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import {
  isValidEmail,
  validatePasswordStrength,
} from "../src/lib/auth/validation";

/**
 * Antarmuka koneksi skrip yang tidak bergantung driver. Menyembunyikan
 * perbedaan tipe konkret Neon vs PGlite sehingga skrip tetap bersih dan
 * type-safe tanpa `any` maupun cast.
 */
export interface ScriptConnection {
  label: string;
  migrate: () => Promise<void>;
  findUserByEmail: (email: string) => Promise<UserRow | undefined>;
  insertUser: (values: NewUser) => Promise<void>;
  updateUser: (id: string, patch: Partial<NewUser>) => Promise<void>;
  close: () => Promise<void>;
}

export async function connect(): Promise<ScriptConnection> {
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    const db = drizzleNeon(neon(url));
    return {
      label: "Neon (produksi)",
      migrate: () => migrateNeon(db, { migrationsFolder: "drizzle" }),
      findUserByEmail: async (email) =>
        (
          await db.select().from(users).where(eq(users.email, email)).limit(1)
        )[0],
      insertUser: async (values) => {
        await db.insert(users).values(values);
      },
      updateUser: async (id, patch) => {
        await db.update(users).set(patch).where(eq(users.id, id));
      },
      close: async () => {},
    };
  }

  const dir = process.env.PGLITE_DIR?.trim() || "./.data/pglite";
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  const db = drizzlePglite(client);

  return {
    label: `PGlite lokal (${dir})`,
    migrate: () => migratePglite(db, { migrationsFolder: "drizzle" }),
    findUserByEmail: async (email) =>
      (
        await db.select().from(users).where(eq(users.email, email)).limit(1)
      )[0],
    insertUser: async (values) => {
      await db.insert(users).values(values);
    },
    updateUser: async (id, patch) => {
      await db.update(users).set(patch).where(eq(users.id, id));
    },
    close: async () => {
      await client.close();
    },
  };
}

export interface SeedOwnerInput {
  email: string;
  password: string;
  name?: string;
}

export async function seedOwner(
  connection: ScriptConnection,
  input: SeedOwnerInput
): Promise<{ created: boolean; email: string }> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new Error("Email owner tidak valid.");
  }
  const passwordError = validatePasswordStrength(input.password);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const passwordHash = await hashPassword(input.password);
  const existing = await connection.findUserByEmail(email);

  if (existing) {
    await connection.updateUser(existing.id, {
      passwordHash,
      role: "owner",
      isActive: true,
      name: input.name?.trim() || existing.name,
      sessionVersion: existing.sessionVersion + 1,
      updatedAt: new Date(),
    });
    return { created: false, email };
  }

  await connection.insertUser({
    email,
    name: input.name?.trim() || "Pemilik",
    passwordHash,
    role: "owner",
    isActive: true,
  });
  return { created: true, email };
}

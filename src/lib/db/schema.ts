import { randomUUID } from "node:crypto";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Skema basis data CMS (Postgres). Dipakai bersama oleh dua driver:
 * - Pengembangan/tes lokal: PGlite (Postgres dalam WASM, tanpa server).
 * - Produksi (Vercel): Neon serverless Postgres.
 * Karena keduanya Postgres, skema dan migrasi identik.
 */

export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "admin",
  "editor",
  "viewer",
]);

export const auditOutcomeEnum = pgEnum("audit_outcome", ["success", "failure"]);

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    email: text("email").notNull(),
    name: text("name").notNull().default(""),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("viewer"),
    isActive: boolean("is_active").notNull().default(true),
    /**
     * Naikkan nilai ini untuk mencabut seluruh sesi pengguna secara instan.
     * Token JWT menyimpan versi saat dibuat; token lama ditolak.
     */
    sessionVersion: integer("session_version").notNull().default(1),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    // Actor bersifat nullable: percobaan login gagal tanpa akun tetap tercatat.
    actorId: text("actor_id"),
    actorEmail: text("actor_email"),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    resourceId: text("resource_id"),
    outcome: auditOutcomeEnum("outcome").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_created_idx").on(table.createdAt),
    index("audit_logs_actor_idx").on(table.actorId),
  ]
);

/**
 * Catatan percobaan autentikasi untuk pembatasan laju (rate limiting) berbasis
 * basis data, agar tetap berfungsi di lingkungan serverless multi-instance.
 * Tidak menyimpan kata sandi; hanya identitas pembatas.
 */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    identifier: text("identifier").notNull(),
    ip: text("ip"),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("login_attempts_identifier_created_idx").on(
      table.identifier,
      table.createdAt
    ),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
  }),
}));

export type UserRow = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuditLogRow = typeof auditLogs.$inferSelect;
export type LoginAttemptRow = typeof loginAttempts.$inferSelect;

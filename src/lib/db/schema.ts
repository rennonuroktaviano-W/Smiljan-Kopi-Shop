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

export const availabilityStatusEnum = pgEnum("availability_status", [
  "available",
  "unavailable",
  "coming-soon",
]);

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

/**
 * Kategori menu. `id` adalah slug stabil (mis. "coffee") yang dipakai sebagai
 * nilai kategori pada item; `label` adalah teks tampilan yang dapat diedit.
 */
export const menuCategories = pgTable(
  "menu_categories",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("menu_categories_sort_idx").on(table.sortOrder)]
);

/**
 * Item menu. `price` nullable: `null` berarti harga resmi belum ditetapkan
 * (UI menampilkan "Harga menyusul"). `isPublished=false` menyembunyikan item
 * dari situs publik tanpa menghapusnya.
 */
export const menuItems = pgTable(
  "menu_items",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    categoryId: text("category_id")
      .notNull()
      .references(() => menuCategories.id),
    price: integer("price"),
    image: text("image").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    availabilityStatus: availabilityStatusEnum("availability_status")
      .notNull()
      .default("available"),
    imageSource: text("image_source").notNull().default(""),
    imageLicense: text("image_license").notNull().default(""),
    sourceUrl: text("source_url").notNull().default(""),
    isPublished: boolean("is_published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("menu_items_category_idx").on(table.categoryId),
    index("menu_items_published_idx").on(table.isPublished),
    index("menu_items_sort_idx").on(table.sortOrder),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const menuCategoriesRelations = relations(menuCategories, ({ many }) => ({
  items: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
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
export type MenuCategoryRow = typeof menuCategories.$inferSelect;
export type NewMenuCategory = typeof menuCategories.$inferInsert;
export type MenuItemRow = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;

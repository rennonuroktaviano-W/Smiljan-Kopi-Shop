import { asc, count, eq } from "drizzle-orm";
import type { DbClient } from "../client";
import {
  menuCategories,
  menuItems,
  type MenuItemRow,
  type NewMenuItem,
} from "../schema";
import {
  isMenuCategory,
  type AvailabilityStatus,
  type MenuItem,
} from "@/types/menu";

/**
 * Lapisan akses data untuk katalog menu. Fungsi-fungsi ini murni menerima
 * klien basis data sehingga dapat dipakai oleh runtime (Neon/PGlite) maupun
 * pengujian. Penerjemahan baris → tipe domain dilakukan di satu tempat.
 */

export interface MenuCategoryRecord {
  id: string;
  label: string;
  sortOrder: number;
}

function toMenuItem(row: MenuItemRow): MenuItem {
  if (!isMenuCategory(row.categoryId)) {
    throw new Error(
      `Kategori tidak dikenal pada item menu "${row.id}": "${row.categoryId}".`
    );
  }
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.categoryId,
    price: row.price,
    image: row.image,
    imageAlt: row.imageAlt,
    featured: row.featured,
    availabilityStatus: row.availabilityStatus as AvailabilityStatus,
    imageSource: row.imageSource,
    imageLicense: row.imageLicense,
    sourceUrl: row.sourceUrl,
  };
}

export async function listMenuCategories(
  db: DbClient
): Promise<MenuCategoryRecord[]> {
  return db
    .select({
      id: menuCategories.id,
      label: menuCategories.label,
      sortOrder: menuCategories.sortOrder,
    })
    .from(menuCategories)
    .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.label));
}

/** Item yang tampil di situs publik (isPublished = true), terurut. */
export async function listPublishedMenuItems(db: DbClient): Promise<MenuItem[]> {
  const rows = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isPublished, true))
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
  return rows.map(toMenuItem);
}

/** Seluruh item baris (termasuk draf) untuk panel admin. */
export async function listMenuItemRows(db: DbClient): Promise<MenuItemRow[]> {
  return db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
}

export async function getMenuItemById(
  db: DbClient,
  id: string
): Promise<MenuItemRow | undefined> {
  return (
    await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1)
  )[0];
}

export async function countMenuItems(db: DbClient): Promise<number> {
  const rows = await db.select({ value: count() }).from(menuItems);
  return rows[0]?.value ?? 0;
}

export async function createMenuItem(
  db: DbClient,
  values: NewMenuItem
): Promise<void> {
  await db.insert(menuItems).values(values);
}

export async function updateMenuItem(
  db: DbClient,
  id: string,
  patch: Partial<NewMenuItem>
): Promise<void> {
  await db
    .update(menuItems)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(menuItems.id, id));
}

export async function setMenuItemPublished(
  db: DbClient,
  id: string,
  isPublished: boolean
): Promise<void> {
  await db
    .update(menuItems)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(menuItems.id, id));
}

export async function deleteMenuItem(db: DbClient, id: string): Promise<void> {
  await db.delete(menuItems).where(eq(menuItems.id, id));
}

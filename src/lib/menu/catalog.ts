import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { listPublishedMenuItems } from "@/lib/db/repositories/menu";
import { menuItems as staticMenuItems } from "@/data/menu";
import type { MenuItem } from "@/types/menu";

/**
 * Sumber katalog menu untuk situs publik.
 *
 * Basis data adalah sumber utama. Namun, agar situs tetap dapat dibangun dan
 * disajikan meski basis data belum tersedia (mis. build CI tanpa DATABASE_URL,
 * atau kegagalan sementara Neon), fungsi ini jatuh kembali ke katalog statis
 * `src/data/menu.json`. Kegagalan dicatat, tidak disembunyikan.
 */
async function loadMenuItems(): Promise<MenuItem[]> {
  try {
    const db = await getDb();
    return await listPublishedMenuItems(db);
  } catch (error) {
    console.warn(
      `[menu] Gagal membaca menu dari basis data; memakai data statis. ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return staticMenuItems;
  }
}

/** Di-cache per request agar beberapa komponen berbagi satu pembacaan. */
export const getMenuItems = cache(loadMenuItems);

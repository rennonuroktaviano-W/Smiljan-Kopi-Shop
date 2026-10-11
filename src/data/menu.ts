import type { MenuCategory, MenuItem } from "@/types/menu";
import { isMenuCategory, availabilityStatuses } from "@/types/menu";
import menuJson from "./menu.json";

/**
 * Katalog menu Smiljan Kopi Shop.
 *
 * Single source of truth ada di `src/data/menu.json` agar mudah diverifikasi
 * oleh script non-TypeScript (lihat `scripts/validate-menu.mjs`). File ini
 * memvalidasi ulang kategori/status lalu meneruskan data sebagai `MenuItem[]`.
 *
 * Catatan harga: karena harga resmi Smiljan belum diterbitkan, seluruh
 * `price` sengaja bernilai `null`. UI menampilkan "Harga menyusul",
 * bukan harga tebakan.
 */
export const menuItems: MenuItem[] = menuJson.map((entry) => {
  if (!isMenuCategory(entry.category)) {
    throw new Error(`Menu "${entry.name}": kategori salah "${entry.category}".`);
  }
  if (!(availabilityStatuses as readonly string[]).includes(entry.availabilityStatus)) {
    throw new Error(
      `Menu "${entry.name}": availabilityStatus salah "${entry.availabilityStatus}".`
    );
  }
  return entry as MenuItem;
});

export const signatureItems: MenuItem[] = menuItems.filter(
  (item) => item.featured && item.availabilityStatus === "available"
);

export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter(
    (item) => item.category === category && item.availabilityStatus === "available"
  );
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getSuggestion(id: string): string | null {
  const item = getMenuItemById(id);
  if (!item) return null;
  return `Halo Smiljan, saya ingin memesan: ${item.name}. Mohon info ketersediaannya.`;
}
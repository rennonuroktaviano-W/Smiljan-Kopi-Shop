export type MenuCategory = "coffee" | "non-coffee" | "food";

export type AvailabilityStatus = "available" | "unavailable" | "coming-soon";

export interface MenuCategoryInfo {
  value: MenuCategory;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  /**
   * Harga dalam Rupiah. `null` berarti harga resmi belum ditetapkan
   * dan UI menampilkan "Harga menyusul" alih-alih angka tebakan.
   */
  price: number | null;
  image: string;
  imageAlt: string;
  featured?: boolean;
  availabilityStatus: AvailabilityStatus;
  /** Nama sumber foto, mis. "Wikimedia Commons" atau "Unsplash". */
  imageSource: string;
  /** Lisensi foto, mis. "CC BY-SA 4.0", "CC0", atau "Unsplash License". */
  imageLicense: string;
  /** URL halaman/file sumber foto untuk verifikasi dan kredit. */
  sourceUrl: string;
}

export const menuCategories: MenuCategoryInfo[] = [
  { value: "coffee", label: "Coffee" },
  { value: "non-coffee", label: "Non-Coffee" },
  { value: "food", label: "Food" },
];

export function isMenuCategory(value: string): value is MenuCategory {
  return menuCategories.some((category) => category.value === value);
}

export const availabilityStatuses: AvailabilityStatus[] = [
  "available",
  "unavailable",
  "coming-soon",
];
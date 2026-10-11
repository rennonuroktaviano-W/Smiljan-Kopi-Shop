import type { MenuCategory, MenuItem } from "@/types/menu";

/**
 * Daftar menu awal (draft) untuk pengembangan.
 *
 * Nama, harga, dan deskripsi akan disesuaikan saat data final tersedia.
 * Simpan seluruh harga di satu tempat ini agar mudah diperbarui.
 */
export const menuItems: MenuItem[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "Single shot pekat dengan crema lembut. Untuk menikmati ristretto?",
    price: 28000,
    category: "coffee",
    image: "/images/menu/espresso.svg",
    imageAlt: "Cangkir espresso hitam bernuansa gelap",
    featured: true,
    available: true,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Espresso berlapis susu steamed dengan latte art klasik.",
    price: 34000,
    category: "coffee",
    image: "/images/menu/cappuccino.svg",
    imageAlt: "Kapucino dengan latte art",
    featured: true,
    available: true,
  },
  {
    id: "pour-over",
    name: "Pour Over",
    description: "Manual brew dengan biji single origin pilihan barista.",
    price: 38000,
    category: "coffee",
    image: "/images/menu/pour-over.svg",
    imageAlt: "Alat pour over dan carafe",
    featured: true,
    available: true,
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Seduhan dingin 16 jam, halus dan rendah asam.",
    price: 36000,
    category: "coffee",
    image: "/images/menu/cold-brew.svg",
    imageAlt: "Cold brew dalam gelas tinggi kaca",
    available: true,
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Matcha dengan susu steamed, creamy dan sedikit earthiness.",
    price: 34000,
    category: "non-coffee",
    image: "/images/menu/matcha.svg",
    imageAlt: "Mangkuk matcha dengan pengocok bambu",
    available: true,
  },
  {
    id: "dark-chocolate",
    name: "Dark Chocolate",
    description: "Cokelat panas smooth dengan cita rasa dark chocolate.",
    price: 32000,
    category: "non-coffee",
    image: "/images/menu/chocolate.svg",
    imageAlt: "Cokelat panas dalam mug",
    available: true,
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    description: "Croissant berlapis mentega, renyah di luar lembut di dalam.",
    price: 26000,
    category: "food",
    image: "/images/menu/croissant.svg",
    imageAlt: "Croissant mentega",
    available: true,
  },
  {
    id: "pastry-set",
    name: "Pastry Set",
    description: "Pilihan pastry ringan, cocok untuk menemani secangkir kopi.",
    price: 30000,
    category: "food",
    image: "/images/menu/pastry.svg",
    imageAlt: "Aneka pastry bulat kecil",
    available: true,
  },
];

export const signatureItems: MenuItem[] = menuItems.filter(
  (item) => item.featured && item.available
);

export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category && item.available);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getSuggestion(id: string): string | null {
  const item = getMenuItemById(id);
  if (!item) return null;
  return `Halo Smiljan, saya ingin memesan: ${item.name}. Mohon info ketersediaannya.`;
}

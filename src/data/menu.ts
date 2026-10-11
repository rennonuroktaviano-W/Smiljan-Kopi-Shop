import type { MenuCategory, MenuItem } from "@/types/menu";

/**
 * Daftar menu awal (draft) untuk pengembangan.
 *
 * Nama, harga, dan deskripsi akan disesuaikan saat data final tersedia.
 * Simpan seluruh harga di satu tempat ini agar mudah diperbarui.
 */
export const menuItems: MenuItem[] = [
  {
    id: "kopi-kenangan-mantan",
    name: "Kopi Kenangan Mantan",
    description: "Kopi susu dengan gula aren asli Indonesia. Klasik yang paling dicari.",
    price: 18000,
    category: "coffee",
    image: "/images/menu/cold-brew.jpg",
    imageAlt: "Es kopi susu gula aren dalam gelas",
    featured: true,
    available: true,
  },
  {
    id: "creamy-aren-latte",
    name: "Creamy Aren Latte",
    description: "Espresso, susu, dan gula aren yang creamy dan lembut.",
    price: 24000,
    category: "coffee",
    image: "/images/menu/cappuccino.jpg",
    imageAlt: "Latte dengan latte art di atasnya",
    featured: true,
    available: true,
  },
  {
    id: "caramel-machiato",
    name: "Caramel Machiato",
    description: "Espresso dan susu dengan lapisan saus karamel yang manis gurih.",
    price: 30000,
    category: "coffee",
    image: "/images/menu/caramel-machiato.jpg",
    imageAlt: "Minuman dingin berlapis dengan saus karamel",
    featured: true,
    available: true,
  },
  {
    id: "hazelnut-latte",
    name: "Hazelnut Latte",
    description: "Espresso dan susu segar dengan aroma hazelnut yang hangat.",
    price: 28000,
    category: "coffee",
    image: "/images/story/philosophy.jpg",
    imageAlt: "Cangkir kopi susu di atas meja",
    available: true,
  },
  {
    id: "mocha-latte",
    name: "Mocha Latte",
    description: "Perpaduan espresso dan cokelat asli dengan susu segar.",
    price: 31000,
    category: "coffee",
    image: "/images/menu/chocolate.jpg",
    imageAlt: "Minuman cokelat dalam mug",
    available: true,
  },
  {
    id: "americano",
    name: "Americano",
    description: "Espresso dengan air panas. Kenikmatan kopi yang bersih dan pekat.",
    price: 20000,
    category: "coffee",
    image: "/images/menu/espresso.jpg",
    imageAlt: "Cangkir kopi hitam bernuansa gelap",
    available: true,
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Teh hijau matcha dengan susu dan gula aren asli Indonesia.",
    price: 25000,
    category: "non-coffee",
    image: "/images/menu/matcha.jpg",
    imageAlt: "Matcha dengan pengocok bambu",
    available: true,
  },
  {
    id: "susu-gula-aren",
    name: "Susu Gula Aren",
    description: "Susu creamy dengan gula aren premium, tanpa kopi. Manisnya pas.",
    price: 18000,
    category: "non-coffee",
    image: "/images/menu/susu-gula-aren.jpg",
    imageAlt: "Minuman susu kekinian dalam gelas",
    available: true,
  },
  {
    id: "susu-sultan-boba",
    name: "Susu Sultan Boba Gula Aren",
    description: "Susu dan gula aren asli Indonesia dengan boba kenyal.",
    price: 24000,
    category: "non-coffee",
    image: "/images/menu/susu-boba.jpg",
    imageAlt: "Es teh susu dengan boba kenyal",
    available: true,
  },
  {
    id: "thai-tea",
    name: "Thai Tea",
    description: "Teh thai yang manis dan pekat, cocok untuk yang ingin tanpa kopi.",
    price: 18000,
    category: "non-coffee",
    image: "/images/menu/thai-tea.jpg",
    imageAlt: "Minuman teh kental dalam gelas",
    available: true,
  },
  {
    id: "es-cokelat",
    name: "Es Cokelat",
    description: "Cokelat asli yang nikmat dan dingin. Manis, berani, menggoda.",
    price: 20000,
    category: "non-coffee",
    image: "/images/menu/es-cokelat.jpg",
    imageAlt: "Minuman cokelat dingin segar",
    available: true,
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    description: "Croissant berlapis mentega, renyah di luar lembut di dalam.",
    price: 22000,
    category: "food",
    image: "/images/menu/croissant.jpg",
    imageAlt: "Croissant mentega",
    available: true,
  },
  {
    id: "pastry-set",
    name: "Pastry Set",
    description: "Pilihan pastry ringan, cocok untuk menemani secangkir kopi.",
    price: 20000,
    category: "food",
    image: "/images/menu/pastry.jpg",
    imageAlt: "Aneka pastry bulat kecil",
    available: true,
  },
  {
    id: "roti-cokelat",
    name: "Roti Cokelat Klasik",
    description: "Roti lembut berisi cokelat klasik, hangat saat disajikan.",
    price: 15000,
    category: "food",
    image: "/images/menu/roti-cokelat.jpg",
    imageAlt: "Roti dengan isian cokelat",
    available: true,
  },
  {
    id: "roti-susu-manis",
    name: "Roti Susu Manis",
    description: "Roti susu yang empuk dan manis, teman ngopi yang pas.",
    price: 15000,
    category: "food",
    image: "/images/menu/roti-susu.jpg",
    imageAlt: "Roti susu manis lembut",
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
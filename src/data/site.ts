export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/our-story", label: "Our Story" },
  { href: "/visit", label: "Visit" },
];

export interface SiteConfig {
  name: string;
  descriptor: string;
  tagline: string;
  headline: string;
  orderCtaLabel: string;
  whatsappNumber: string;
  instagramUrl: string;
  tiktokUrl: string;
  addressLine1: string;
  addressLine2: string;
  mapsUrl: string;
  businessArea: string;
  businessInfoReady: boolean;
}

/**
 * Sumber tunggal konfigurasi bisnis.
 * Nilai dibaca dari environment (NEXT_PUBLIC_*). Kosong = data belum
 * diverifikasi; UI menampilkan placeholder development yang jelas.
 */
export const siteConfig: SiteConfig = {
  name: "SMILJAN",
  descriptor: "KOPI SHOP",
  tagline: "Good Coffee. Better Days.",
  headline: "More Than Just Coffee.",
  orderCtaLabel: "Order Coffee",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, "") ?? "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ?? "",
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() ?? "",
  addressLine1: process.env.NEXT_PUBLIC_ADDRESS_LINE_1?.trim() ?? "",
  addressLine2: process.env.NEXT_PUBLIC_ADDRESS_LINE_2?.trim() ?? "",
  mapsUrl: process.env.NEXT_PUBLIC_MAPS_URL?.trim() ?? "",
  businessArea: process.env.NEXT_PUBLIC_BUSINESS_AREA?.trim() ?? "",
  businessInfoReady: process.env.NEXT_PUBLIC_BUSINESS_INFO_READY === "true",
};

export const isWhatsAppConfigured = siteConfig.whatsappNumber.length >= 8;
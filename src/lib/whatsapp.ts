import { isWhatsAppConfigured, siteConfig } from "@/data/site";

export interface OrderItem {
  name: string;
  quantity?: number;
}

const DEFAULT_WA_TEXT =
  "Halo Smiljan, saya ingin bertanya tentang menu dan ketersediaannya.";

function buildNumber(): string | null {
  if (!isWhatsAppConfigured) return null;
  return siteConfig.whatsappNumber;
}

/**
 * Membangun link WhatsApp untuk pemesanan. Mengembalikan null jika nomor
 * belum tersedia sehingga UI dapat menampilkan tombol nonaktif.
 */
export function buildWhatsAppOrderLink(items: OrderItem[]): string | null {
  const number = buildNumber();
  if (!number) return null;

  const lines = items.map((item, index) => {
    const quantity =
      typeof item.quantity === "number" && item.quantity > 1
        ? ` (x${item.quantity})`
        : "";
    return `${index + 1}. ${item.name}${quantity}`;
  });

  const text = [
    `Halo Smiljan, saya ingin memesan:`,
    ...lines,
    `Mohon info ketersediaannya.`,
  ].join("\n");

  return `https://wa.me/${number}?${new URLSearchParams({ text }).toString()}`;
}

export function buildWhatsAppGeneralLink(customText?: string): string | null {
  const number = buildNumber();
  if (!number) return null;

  const text = customText || DEFAULT_WA_TEXT;
  return `https://wa.me/${number}?${new URLSearchParams({ text }).toString()}`;
}

export function buildWhatsAppVisitLink(): string | null {
  const number = buildNumber();
  if (!number) return null;

  const text = "Halo Smiljan, saya ingin bertanya tentang lokasi dan jam buka.";
  return `https://wa.me/${number}?${new URLSearchParams({ text }).toString()}`;
}
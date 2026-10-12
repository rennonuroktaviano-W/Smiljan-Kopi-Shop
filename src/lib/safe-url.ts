/**
 * Mengembalikan URL hanya jika berupa URL absolut http/https yang valid.
 * Nilai lain (termasuk skema berbahaya seperti `javascript:` atau `data:`)
 * dikembalikan sebagai string kosong agar tautan tidak dirender.
 */
export function toSafeExternalUrl(value: string | undefined | null): string {
  const raw = value?.trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

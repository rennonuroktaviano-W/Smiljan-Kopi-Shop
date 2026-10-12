import {
  availabilityStatuses,
  type AvailabilityStatus,
} from "@/types/menu";

/**
 * Validasi input formulir item menu. Dipakai oleh server action — validasi di
 * klien hanya demi kenyamanan, bukan pengamanan.
 */

export interface MenuItemDraft {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  /** Harga mentah dari formulir; string kosong berarti "belum ditetapkan". */
  price: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  availabilityStatus: string;
  imageSource: string;
  imageLicense: string;
  sourceUrl: string;
  isPublished: boolean;
}

export interface MenuItemInput {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number | null;
  image: string;
  imageAlt: string;
  featured: boolean;
  availabilityStatus: AvailabilityStatus;
  imageSource: string;
  imageLicense: string;
  sourceUrl: string;
  isPublished: boolean;
}

export type MenuItemValidation =
  | { ok: true; value: MenuItemInput }
  | { ok: false; errors: Record<string, string> };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PRICE = 100_000_000;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateMenuItem(draft: MenuItemDraft): MenuItemValidation {
  const errors: Record<string, string> = {};

  const id = draft.id.trim();
  const name = draft.name.trim();
  const description = draft.description.trim();
  const categoryId = draft.categoryId.trim();
  const image = draft.image.trim();
  const imageAlt = draft.imageAlt.trim();
  const imageSource = draft.imageSource.trim();
  const imageLicense = draft.imageLicense.trim();
  const sourceUrl = draft.sourceUrl.trim();
  const priceRaw = draft.price.trim();

  if (!id) {
    errors.id = "ID wajib diisi.";
  } else if (id.length > 80) {
    errors.id = "ID maksimal 80 karakter.";
  } else if (!SLUG_PATTERN.test(id)) {
    errors.id = "ID hanya boleh huruf kecil, angka, dan tanda hubung.";
  }

  if (!name) {
    errors.name = "Nama wajib diisi.";
  } else if (name.length > 120) {
    errors.name = "Nama maksimal 120 karakter.";
  }

  if (description.length > 600) {
    errors.description = "Deskripsi maksimal 600 karakter.";
  }

  if (!categoryId) {
    errors.categoryId = "Kategori wajib dipilih.";
  }

  let price: number | null = null;
  if (priceRaw) {
    const parsed = Number(priceRaw);
    if (!Number.isInteger(parsed) || parsed < 0) {
      errors.price = "Harga harus bilangan bulat minimal 0.";
    } else if (parsed > MAX_PRICE) {
      errors.price = "Harga di luar batas wajar.";
    } else {
      price = parsed;
    }
  }

  if (!image) {
    errors.image = "Path/URL gambar wajib diisi.";
  }

  if (!imageAlt) {
    errors.imageAlt = "Teks alternatif gambar wajib diisi.";
  }

  if (!(availabilityStatuses as readonly string[]).includes(draft.availabilityStatus)) {
    errors.availabilityStatus = "Status ketersediaan tidak valid.";
  }

  if (sourceUrl && !isHttpUrl(sourceUrl)) {
    errors.sourceUrl = "URL sumber harus diawali http:// atau https://.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      id,
      name,
      description,
      categoryId,
      price,
      image,
      imageAlt,
      featured: draft.featured,
      availabilityStatus: draft.availabilityStatus as AvailabilityStatus,
      imageSource,
      imageLicense,
      sourceUrl,
      isPublished: draft.isPublished,
    },
  };
}

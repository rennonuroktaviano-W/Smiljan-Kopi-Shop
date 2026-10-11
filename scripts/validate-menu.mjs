#!/usr/bin/env node
/**
 * Validasi katalog menu & aset foto (single source: src/data/menu.json).
 *
 * Cek yang dilakukan:
 *  1. Struktur: field wajib ada, id unik, kategori/status valid.
 *  2. Harga: `price` harus null atau angka >= 0 (tidak menebak harga).
 *  3. Aset: file gambar di bawah `public/` benar-benar ada.
 *  4. Sumber: imageSource, imageLicense, dan sourceUrl wajib terisi.
 *
 * Jalankan: `npm run validate:menu`
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const menuPath = join(root, "src", "data", "menu.json");

const REQUIRED_FIELDS = [
  "id",
  "name",
  "category",
  "description",
  "image",
  "imageAlt",
  "availabilityStatus",
  "imageSource",
  "imageLicense",
  "sourceUrl",
];

const VALID_CATEGORIES = ["coffee", "non-coffee", "food"];
const VALID_STATUSES = ["available", "unavailable", "coming-soon"];

const errors = [];
const warnings = [];

let items;
try {
  items = JSON.parse(readFileSync(menuPath, "utf8"));
} catch (error) {
  console.error(`Gagal membaca ${menuPath}: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(items)) {
  console.error("menu.json harus berupa array.");
  process.exit(1);
}

const ids = new Set();
const imagePaths = new Set();

items.forEach((item, index) => {
  const label = `menu[${index}] (${item?.id ?? "<tanpa id>"})`;

  for (const field of REQUIRED_FIELDS) {
    if (typeof item?.[field] !== "string" || item[field].trim() === "") {
      errors.push(`${label}: field wajib "${field}" kosong atau bukan string.`);
    }
  }

  if (typeof item?.name === "string") {
    if (ids.has(item.name)) {
      errors.push(`${label}: nama duplikat "${item.name}".`);
    }
    ids.add(item.name);
  }

  if (item?.category && !VALID_CATEGORIES.includes(item.category)) {
    errors.push(
      `${label}: kategori "${item.category}" tidak valid. Harus salah satu dari ${VALID_CATEGORIES.join(", ")}.`
    );
  }

  if (item?.availabilityStatus && !VALID_STATUSES.includes(item.availabilityStatus)) {
    errors.push(
      `${label}: availabilityStatus "${item.availabilityStatus}" tidak valid. Harus salah satu dari ${VALID_STATUSES.join(", ")}.`
    );
  }

  const price = item?.price;
  if (price !== null && price !== undefined) {
    if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
      errors.push(`${label}: price harus null atau angka >= 0 (dapat ${JSON.stringify(price)}).`);
    } else {
      warnings.push(
        `${label}: harga angka tidak disarankan; konfirmasi harga resmi sebelum dipakai.`
      );
    }
  }

  if (item?.image) {
    const publicPath = join(root, "public", item.image.replace(/^\/+/, ""));
    if (!existsSync(publicPath)) {
      errors.push(`${label}: file gambar tidak ditemukan -> public${item.image}`);
    }
  }

  if (typeof item?.id === "string" && item.id.startsWith("/")) {
    errors.push(`${label}: id tidak boleh dimulai dengan "/".`);
  }

  const imagePath = item?.image;
  if (imagePath && imagePaths.has(imagePath)) {
    errors.push(`${label}: path gambar "${imagePath}" dipakai lebih dari satu item (jangan reuse foto antar produk).`);
  }
  if (imagePath) imagePaths.add(imagePath);
});

if (errors.length > 0) {
  console.error(`VALIDASI GAGAL — ${errors.length} error:`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error();
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`${warnings.length} peringatan:`);
  for (const warning of warnings) console.warn(`  - ${warning}`);
  console.warn();
}

console.log(
  `OK — ${items.length} item menu valid; ${imagePaths.size} aset foto unik hadir di public/.`
);
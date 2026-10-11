# SMILJAN Kopi Shop

Website editorial & minimal untuk **SMILJAN Kopi Shop** — "Kopi Baik, Hari Baik." (copy telah disetujui pemilik.)

Dibangun dengan Next.js (App Router), TypeScript, dan Tailwind CSS v4. Seluruh rute di-prerender secara statis.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`, tidak ada `tailwind.config`)
- **Font:** Playfair Display + Manrope via `next/font/google`
- **Lint:** ESLint (`eslint`)
- **Typecheck:** `tsc --noEmit`

## Scripts

```bash
npm run dev             # development server
npm run build           # production build
npm run start           # serve production build
npm run lint            # ESLint
npm run typecheck       # TypeScript type check
npm run test:e2e        # Playwright: routes/console, matrix viewport, a11y, WhatsApp nonaktif
npm run test:e2e:whatsapp  # Playwright: alur WhatsApp AKTIF (build terpisah + nomor uji)
```

## Testing & Hasil Pemeriksaan

Perintah dijalankan pada **11 Oktober 2026** (Windows, Node 22, Chromium via Playwright).

### Lint, typecheck, dan build

| Gate | Hasil |
|---|---|
| `npm run lint` | 0 error, 0 warning |
| `npm run typecheck` | 0 error |
| `npm run build` | sukses, semua route static (6 : `/`, `/menu`, `/our-story`, `/visit`, `/sitemap.xml`, `/robots.txt`) |

### Playwright (Chromium)

- `npm run test:e2e` — **29/29 lulus**: setiap route HTTP 200 tanpa console/page errors dan tanpa request gagal (termasuk favicon); satu `h1` dan `alt` pada semua gambar; skip-link; filter keyboard dengan `aria-pressed`; drawer mobile buka/Tutup + Escape; reduced-motion (konten langsung terlihat); **tidak ada overflow horizontal** di 9 viewport PRD (320×568 … 1920×1080) + zoom 200% (via CDP); WhatsApp nonaktif → CTA disabled tanpa tautan `wa.me`.
- `npm run test:e2e:whatsapp` — **2/2 lulus**: dengan build bernomor uji, CTA order membuat `https://wa.me/6281234567890?text=…` dan teks persis mengikuti contoh PRD §9 (`Halo Smiljan, saya ingin memesan:\n1. Espresso\nMohon info ketersediaannya.`).

### Lighthouse (build produksi, throttling mobile bawaan)

| Halaman | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|--:|--:|--:|--:|--:|--:|
| `/` | 92 | 100 | 100 | 100 | 2.9 s | 0 | ~160–240 ms |
| `/menu` | 94 | 100 | 100 | 100 | 2.9 s | 0 | 160 ms |

Catatan jujur sesuai PRD §2/§16: LCP/CWV di atas adalah **pengukuran lab** pada koneksi lokal + throttling; angka lapangan (field data) belum tersedia karena belum ada traffic produksi. Target LCP ≤ 2.5 s di persentil ke-75 **tidak diklaim** hingga terukur dari data lapangan.

Reproduksi (butuh path Chrome):
```bash
npm run build
npm run start -- --port 3110
npx lighthouse http://localhost:3110/ --only-categories=performance,accessibility,best-practices,seo --output=json --chrome-path="<path-ke-chrome.exe>"
```

Satu-satunya blocker rilis tersisa: **data pemilik belum tersedia** (menu/harga asli, nomor WhatsApp, alamat, jam buka, foto). Sebelum itu, halaman menampilkan pesan "segara hadir" sesuai PRD §9/§11/§19.

## Struktur Penting

```
src/
  app/            # routes: /, /menu, /our-story, /visit + sitemap/robots + error/not-found/loading
  components/
    home/         # section homepage (Hero, SignatureMenu, Philosophy, EditorialBreak, VisitSection, ClosingCta)
    menu/         # ProductCard, MenuGrid (filter kategori client-side)
    layout/       # Header (transparan, drawer mobile), Footer, Container
    ui/           # CtaLink, ExternalLink, DisabledCta, Reveal, SectionHeading, Logo, DevNotice
  data/           # site.ts (konfigurasi bisnis dari env), menu.ts (data produk)
  lib/            # whatsapp.ts (link pemesanan), format-currency.ts (IDR)
  types/          # menu.ts (kategori, item)
```

## Konfigurasi Bisnis

Salin `.env.example` menjadi `.env.local` lalu isi nilai sesuai bisnis:

```bash
cp .env.example .env.local
```

Variabel `NEXT_PUBLIC_*` dibaca oleh `src/data/site.ts`. Selama data bisnis belum final:

- CTA WhatsApp/pemesanan tampil sebagai tombol nonaktif dengan keterangan jelas (tidak mengirim link `wa.me` tanpa nomor).
- Halaman menu/kunjungan menampilkan pesan "segara hadir" selama data belum final.
- `NEXT_PUBLIC_BUSINESS_INFO_READY=true` hanya setelah seluruh data bisnis final dan terverifikasi.

Jangan commit `.env.local`. Hanya `.env.example` yang boleh masuk repository.

## Aset Gambar Sementara

Selama foto asli belum tersedia, `public/images/` diisi ilustrasi SVG bernuansa brand. Ganti dengan aset asli (logo, foto produk, barista, interior) sebelum launch produksi.

## Deployment

Build statis menjalankan `next build` saja sudah cukup (seluruh rute prerender). Publikasikan dengan cara yang Anda gunakan (Vercel, Netlify, Node server, dsb.), pastikan variabel `NEXT_PUBLIC_*` di-set sesuai environment.
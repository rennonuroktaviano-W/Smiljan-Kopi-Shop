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
npm run validate:menu   # validasi katalog menu & aset foto (menu.json)
npm run verify:headers  # verifikasi header keamanan situs terdeploy: npm run verify:headers -- https://domain
npm run test:e2e        # Playwright: routes/console, matrix viewport, a11y, admin auth, SEO, WhatsApp nonaktif
npm run test:e2e:whatsapp  # Playwright: alur WhatsApp AKTIF (build terpisah + nomor uji)
npm run db:generate     # buat migrasi Drizzle dari skema (src/lib/db/schema.ts)
npm run db:migrate      # terapkan migrasi ke DATABASE_URL (atau PGlite lokal)
npm run db:prepare      # migrate + seed akun pemilik + sinkronkan katalog menu (dipakai CI e2e & setup lokal)
npm run db:seed:menu    # salin katalog menu statis (menu.json) ke basis data (idempoten)
npm run create-owner    # buat/perbarui akun pemilik (owner)
```

## Tentang Next.js 16 & rute statis

Seluruh halaman publik (`/`, `/menu`, `/our-story`, `/visit`, `/privacy`) tetap **prerender statis**. Area `/admin` bersifat dinamis (`force-dynamic`) dan dilindungi di dua lapis: Proxy (middleware di `src/proxy.ts`) untuk redirect cepat, dan pemeriksaan server (`requireUser`/`can`) di setiap layout/action. Otorisasi bersifat *default-deny* — batas sebenarnya ada di server, bukan di UI.

## Admin CMS

Area administrasi ada di `/admin` (login di `/admin/login`).

- **Auth:** Auth.js v5 (Credentials) dengan sesi JWT; kata sandi di-hash `scrypt` (`crypto.scrypt`) dan dicabut melalui `users.sessionVersion` yang diperiksa di server.
- **Peran:** `owner` | `admin` | `editor` | `viewer`, dipetakan ke izin lewat `can(role, permission)` (`src/lib/auth/roles.ts`).
- **Database:** Drizzle ORM. Produksi memakai Postgres Neon (`DATABASE_URL`); lokal/tes memakai PGlite embedded (tanpa Docker) dengan `ALLOW_LOCAL_DB=1`.
- **Audit:** setiap login (berhasil/gagal) dan aksi tulis dicatat ke tabel `audit_logs`; login dibatasi (rate limit) via `login_attempts`.
- **Katalog menu:** tabel `menu_categories` + `menu_items` menjadi sumber konten. `npm run db:prepare` (atau `db:seed:menu`) menyalin `src/data/menu.json` ke basis data. Halaman publik `/menu` membaca basis data (ISR 60 detik) dan **jatuh kembali ke `menu.json`** bila basis data tidak tersedia, sehingga situs tetap dapat dibangun tanpa `DATABASE_URL`.

### Menjalankan admin di lokal

1. Salin env: `cp .env.example .env.local`, isi `OWNER_EMAIL`/`OWNER_PASSWORD`, dan setel `ALLOW_LOCAL_DB=1` (serta `AUTH_SECRET`).
2. Siapkan database + akun owner: `npm run db:prepare`.
3. Jalankan `npm run dev` lalu buka `http://localhost:3000/admin`.

Di produksi: setel `DATABASE_URL` (Neon pooled), `AUTH_SECRET`, dan `AUTH_URL`; jalankan `npm run db:migrate` lalu `npm run create-owner`. **Jangan** setel `ALLOW_LOCAL_DB` di produksi.


## Testing & Hasil Pemeriksaan

Perintah dijalankan pada **11 Oktober 2026** (Windows, Node 22, Chromium via Playwright).

### Lint, typecheck, dan build

| Gate | Hasil |
|---|---|
| `npm run lint` | 0 error, 0 warning |
| `npm run typecheck` | 0 error |
| `npm run validate:menu` | 13 item valid, 13 aset foto unik ada di `public/` |
| `npm run build` | sukses, semua route static (6 : `/`, `/menu`, `/our-story`, `/visit`, `/sitemap.xml`, `/robots.txt`) |

### Playwright (Chromium)

- `npm run test:e2e` — **29/29 lulus**: setiap route HTTP 200 tanpa console/page errors dan tanpa request gagal (termasuk favicon); satu `h1` dan `alt` pada semua gambar; skip-link; filter keyboard dengan `aria-pressed`; drawer mobile buka/Tutup + Escape; reduced-motion (konten langsung terlihat); **tidak ada overflow horizontal** di 9 viewport (320×568 … 1920×1080) + zoom 200% (via CDP); WhatsApp nonaktif → CTA disabled tanpa tautan `wa.me`.
- `npm run test:e2e:whatsapp` — **2/2 lulus**: dengan build bernomor uji, CTA order membuat `https://wa.me/6281234567890?text=…` dan teks persis mengikuti contoh pesan (`Halo Smiljan, saya ingin memesan:\n1. Kopi Kenangan Mantan\nMohon info ketersediaannya.`).

### Lighthouse (build produksi, throttling mobile bawaan)

| Halaman | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|--:|--:|--:|--:|--:|--:|
| `/` | 92 | 100 | 100 | 100 | 2.9 s | 0 | ~160–240 ms |
| `/menu` | 94 | 100 | 100 | 100 | 2.9 s | 0 | 160 ms |

Catatan jujur: LCP/CWV di atas adalah **pengukuran lab** pada koneksi lokal + throttling; angka lapangan (field data) belum tersedia karena belum ada traffic produksi. Target LCP ≤ 2.5 s di persentil ke-75 **tidak diklaim** hingga terukur dari data lapangan.

Reproduksi (butuh path Chrome):
```bash
npm run build
npm run start -- --port 3110
npx lighthouse http://localhost:3110/ --only-categories=performance,accessibility,best-practices,seo --output=json --chrome-path="<path-ke-chrome.exe>"
```

Satu-satunya blocker rilis tersisa: **data pemilik belum tersedia** (menu/harga asli, nomor WhatsApp, alamat, jam buka, foto). Sebelum itu, halaman menampilkan pesan "segara hadir".

## Struktur Penting

```
src/
  app/            # routes: /, /menu, /our-story, /visit, /privacy + sitemap/robots + error/not-found/loading
  components/
    home/         # section homepage (Hero, SignatureMenu, Philosophy, EditorialBreak, VisitSection, ClosingCta)
    menu/         # ProductCard, MenuGrid (filter kategori client-side)
    layout/       # Header (transparan, drawer mobile), Footer, Container
    ui/           # CtaLink, ExternalLink, DisabledCta, Reveal, SectionHeading, Logo, DevNotice
  data/           # site.ts (konfigurasi bisnis dari env), menu.ts + menu.json (katalog produk)
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

Analytics bersifat opsional dan tanpa cookie: isi `NEXT_PUBLIC_CF_BEACON_TOKEN` untuk mengaktifkan Cloudflare Web Analytics, atau biarkan kosong untuk menonaktifkannya sepenuhnya. Detail: [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md) bagian 10 dan halaman [`/privacy`](src/app/privacy/page.tsx).

## Foto Contoh untuk Demo

Foto di `public/images/` adalah contoh dari Unsplash & Wikimedia Commons untuk kebutuhan demo client; ganti dengan foto asli milik Smiljan (logo, produk, barista, interior) sebelum rilis produksi. Teks alternatif (alt) sudah ditulis deskriptif agar mudah disesuaikan. `public/images/menu/coffee-beans.svg` dipertahankan sebagai gambar fallback ketika sebuah foto gagal dimuat.

### Katalog menu — single source of truth

Katalog menu ada di **`src/data/menu.json`**. Setiap item memuat:

- `id`, `name`, `category` (`coffee` | `non-coffee` | `food`), `description`
- `price` — **`null` berarti harga resmi belum ditentukan** dan UI menampilkan "Harga menyusul". Jangan memasukkan harga tebakan.
- `image`, `imageAlt`
- `availabilityStatus` — `available` | `unavailable` | `coming-soon`
- `imageSource`, `imageLicense`, `sourceUrl` — atribusi foto agar bisa diverifikasi.

Validasi data & aset: `npm run validate:menu` mengecek field wajib, id unik, kategori/status valid, `price` beralasan (null atau angka ≥ 0), file gambar benar-benar ada di `public/`, dan tak ada foto yang dipakai ulang antar produk. Nama/status item diverifikasi dari berita 2026 yang mengutip Instagram resmi @kopikenangan.id, mis. [Daftar Promo Kopi Kenangan Juli (Kontan/Moms Money)](https://momsmoney.kontan.co.id/news/daftar-promo-kopi-kenangan-juli-minuman-kue-mulai-rp-19-ribu) — item yang menegaskan Kopi Kenangan Mantan, Americano, dan Roti Cokelat Klasik tersedia.

Catatan: harga seluruh item Smiljan sengaja `null` ("Harga menyusul") karena harga resmi belum diterbitkan; harga Kopi Kenangan tidak digunakan sebagai harga Smiljan. Situs ini adalah milik Smiljan dan tidak berafiliasi dengan Kopi Kenangan.

## Deployment

Build statis menjalankan `next build` saja sudah cukup (seluruh rute prerender). Publikasikan dengan cara yang Anda gunakan (Vercel, Netlify, Node server, dsb.), pastikan variabel `NEXT_PUBLIC_*` di-set sesuai environment.

Untuk proteksi DDoS/WAF/bot di lapisan edge, ikuti [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md) dan selengkapnya di [`SECURITY.md`](SECURITY.md).
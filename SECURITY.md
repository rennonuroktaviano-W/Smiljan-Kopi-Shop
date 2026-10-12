# Keamanan — SMILJAN Kopi Shop

Dokumen ini merangkum hasil audit keamanan, proteksi yang **sudah aktif di kode**,
proteksi yang **harus dikonfigurasi di infrastruktur oleh manusia**, serta sisa
risiko yang diketahui. Tidak ada sistem yang kebal dari serangan atau DDoS;
dokumen ini membedakan dengan jelas apa yang terverifikasi dan apa yang belum.

Terakhir diperbarui: 12 Oktober 2026.

## 1. Ringkasan Arsitektur (Dasar Audit)

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Statis:** seluruh rute di-prerender. Tidak ada API route, server action,
  route handler dinamis, middleware, database, unggahan file, atau autentikasi.
- Satu-satunya interaksi keluar adalah tautan `wa.me` (WhatsApp) dan tautan
  sosial/peta opsional dari environment. Tidak ada form yang mengirim data ke server.
- Tidak ada sistem login/admin; situs murni publik. Karena itu:
  - Rate limiting aplikasi, CSRF, CORS, dan kontrol sesi **tidak berlaku**
    (tidak ada endpoint yang menerima input).
  - Yang tetap relevan: header keamanan, kebocoran versi framework, validasi
    URL dari environment, dan mitigasi DDoS/bot di lapisan edge.

## 2. Temuan & Status

### T-1 (Tinggi) — Header keamanan HTTP belum ada — **DIPERBAIKI DI KODE**

- **Bukti:** Sebelum perubahan, `next.config.ts` tidak mendefinisikan `headers()`;
  respons tidak memuat CSP, HSTS, `X-Content-Type-Options`, proteksi clickjacking,
  `Referrer-Policy`, maupun `Permissions-Policy`.
- **Dampak:** Tidak ada pertahanan berlapis terhadap XSS/clickjacking/MIME
  sniffing; tidak ada paksaan HTTPS bagi pengunjung.
- **Perbaikan:** `next.config.ts` kini mengirim:
  `Content-Security-Policy` (`default-src 'self'`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (kamera/mikrofon/geolokasi dimatikan),
  `Cross-Origin-Opener-Policy: same-origin`,
  `Cross-Origin-Resource-Policy: same-origin`, dan
  `Strict-Transport-Security` pada produksi.
- **Verifikasi:** otomatis via `e2e/security-headers.spec.ts`.

### T-2 (Sedang) — Pengungkapan versi framework — **DIPERBAIKI DI KODE**

- **Bukti:** Header `X-Powered-By` default Next.js membocorkan stack.
- **Perbaikan:** `poweredByHeader: false` di `next.config.ts`.
- **Verifikasi:** asersi `x-powered-by` tidak ada di `e2e/security-headers.spec.ts`.

### T-3 (Rendah) — URL dari environment dirender langsung ke `href` — **DIPERBAIKI DI KODE**

- **Bukti:** `instagramUrl`, `tiktokUrl`, dan `mapsUrl` dari `NEXT_PUBLIC_*`
  dulu hanya di-`trim()` lalu dirender menjadi `href`. Nilai salah (mis.
  `javascript:`) akan menjadi tautan berbahaya.
- **Perbaikan:** helper `src/lib/safe-url.ts` hanya menerima URL absolut
  `http:`/`https:`; selain itu ditolak (tautan tidak dirender).
- **Verifikasi:** typecheck + lint + build; nilai tidak valid kini menghasilkan
  string kosong dan UI memakai fallback yang sudah ada.

### T-4 (Sedang, infrastruktur) — DDoS volumetrik & bot — **BELUM AKTIF**

- **Dampak:** Serangan volumetric (L3/L4) dan HTTP flood **tidak dapat** dihentikan
  oleh kode aplikasi. Wajib ditangani di CDN/WAF/DNS/hosting.
- **Tindakan manusia diperlukan:** lihat bagian 4 (checklist deployment).
  Tidak ada klaim proteksi DDoS aktif sampai langkah tersebut dijalankan.

### T-5 (Sedang, dev-only) — Advisory dependensi pengembangan — **TERDOKUMENTASI**

- **Bukti:** `npm audit` melaporkan 5 advisory "high" seluruhnya di rantai
  **devDependencies**: `eslint-config-next → @next/eslint-plugin-next → fast-glob
  → micromatch → braces` (GHSA-vfj7-8cjw-p6xm, stack-exhaustion DoS).
- **Dampak:** Hanya alat lint saat pengembangan/CI; **tidak ikut** ke runtime
  produksi (`npm audit --omit=dev` = 0 kerentanan). Tidak dapat dieksploitasi
  dari lalu lintas web situs ini.
- **Status:** Tidak ada perbaikan aman saat ini — saran `npm audit fix` menurunkan
  `eslint-config-next` ke 14.2.35 (mundur major, tidak kompatibel dengan Next 16).
  Ditangani dengan pemantauan (workflow `security` mingguan) sampai rilis resmi
  dari rantai `eslint-config-next` memperbarui `braces`.

### T-6 (Info) — Tidak ada rahasia yang ter-commit

- **Bukti:** pemindaian `git grep` seluruh riwayat + `.gitignore` menutup `.env*`
  (kecuali `.env.example`). Tidak ditemukan API key, token, atau private key.
- **Catatan:** `.env.example` hanya berisi nama variabel + placeholder.

### T-7 (Info) — Tidak ada autentikasi/admin

Situs tidak memiliki akun, dashboard, atau data pelanggan. Karena itu tidak
ditambahkan sistem login buatan. Bila fitur admin/pesanan server ditambahkan
nanti, wajib menerapkan: autentikasi server-side, otorisasi per-route, MFA untuk
akun istimewa, rate limit login, dan validasi skema input (mis. Zod) — lihat
bagian 6.

## 3. Perubahan yang Diimplementasikan

| File | Alasan |
|---|---|
| `next.config.ts` | Header keamanan CSP/HSTS/nosniff/frame/referrer/permissions/COOP/CORP, `poweredByHeader: false`, `reactStrictMode` |
| `src/lib/safe-url.ts` | Validasi URL eksternal (hanya `http`/`https`) |
| `src/data/site.ts` | Memakai `toSafeExternalUrl` untuk Instagram/TikTok/Maps |
| `e2e/security-headers.spec.ts` | Uji otomatis header keamanan di 4 rute |
| `.github/workflows/security.yml` | CI: lint, typecheck, validate menu, build, audit produksi, pemindaian rahasia (gitleaks) |
| `SECURITY.md` | Dokumen ini |

## 4. Checklist Deployment (Aksi Manusia)

> Pilih hosting yang dipakai; langkah di bawah generik. **Jangan ubah DNS
> produksi tanpa otorisasi dan rencana rollback.**

### 4.1 HTTPS & header

- [ ] Pastikan situs disajikan via HTTPS dengan sertifikat valid (Let's Encrypt/hosting).
- [ ] Verifikasi header dengan `npm run verify:headers -- https://<domain>`
      (atau `curl -sI https://<domain>`).
- [ ] Setelah semua subdomain dipastikan HTTPS, opsional ubah HSTS menjadi
      `max-age=63072000; includeSubDomains; preload` di `next.config.ts`.

### 4.2 CDN/WAF/DDoS (Cloudflare)

**Panduan langkah demi langkah: [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).**
Ringkasan:

1. Tambahkan domain ke Cloudflare, arahkan nameserver.
2. Aktifkan proxy (awan oranye) untuk record `A`/`CNAME` situs.
3. SSL/TLS → mode **Full (strict)**.
4. Security → **WAF Managed Rules**: aktifkan set bawaan (OWASP).
5. Security → **Bots**: aktifkan Bot Fight Mode atau Super Bot Fight Mode.
   Jangan tantang semua pengunjung — cukup endpoint sensitif.
6. Security → **Rate limiting rules**: lihat 4.3.
7. Caching → **Cache Rules**: cache `/_next/static/*`, `/images/*`, favicon,
   dan respons GET publik (HTML dapat di-cache dengan TTL sedang + revalidate).
8. **Kunci origin** agar tidak bisa diakses langsung: batasi firewall origin
   hanya menerima IP Cloudflare, atau gunakan **Authenticated Origin Pulls**
   (mTLS). Tanpa ini, penyerang bisa mem-bypass WAF lewat IP asli.

### 4.3 Rate limiting (di edge, bukan kode)

Karena tidak ada endpoint dinamis, rate limit cukup di edge:
- Aturan kasar per-IP untuk seluruh situs (mis. 300 req/menit) → mitigasi flood.
- Aturan lebih ketat untuk jalur mahal bila nanti ada (`/api/*`, form, pencarian).
- Gunakan shared store milik provider (bukan memori proses). Kembalikan HTTP 429.
- Tuning: mulai longgar, tinjau log, jangan sampai memblokir pelanggan wajar.

### 4.4 Vercel (jika deploy ke Vercel)

- [ ] Aktifkan **Vercel Firewall** (WAF + DDoS mitigation bawaan).
- [ ] Aktifkan **Bot Management** dan aturan rate limit per-IP.
- [ ] Lindungi/samarkan preview deployment dari publik.
- [ ] Set env `NEXT_PUBLIC_*` di Project Settings (nama di bagian 5).
- [ ] Aktifkan notifikasi error & usage spike.

### 4.5 Monitoring & alert

- [ ] Aktifkan alert provider: lonjakan traffic, error 5xx, latensi, WAF events.
- [ ] Selama insiden: naikkan tantangan bot ke "challenge semua" sementara,
      turunkan ambang rate limit, pantau log WAF.
- [ ] Rotasi rahasia yang dicurigai bocor, restore deployment known-good,
      hubungi dukungan hosting.

### 4.6 Akun & akses

- [ ] Aktifkan MFA pada GitHub, hosting, registrar DNS, dan penyedia email.
- [ ] Batasi akses repo/deployment ke orang yang benar-benar perlu.
- [ ] Backup: simpan konfigurasi env di password manager; jaga riwayat deployment.

## 5. Environment Variables (nama saja, tanpa nilai)

| Nama | Publik? | Catatan |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ya | Digit saja; divalidasi |
| `NEXT_PUBLIC_BUSINESS_NAME` | ya | Nama bisnis |
| `NEXT_PUBLIC_BUSINESS_AREA` | ya | Area/kota |
| `NEXT_PUBLIC_SITE_URL` | ya | URL kanonik HTTPS |
| `NEXT_PUBLIC_INSTAGRAM_URL` | ya | Wajib `https://` valid |
| `NEXT_PUBLIC_TIKTOK_URL` | ya | Wajib `https://` valid |
| `NEXT_PUBLIC_ADDRESS_LINE_1` / `_2` | ya | Alamat |
| `NEXT_PUBLIC_MAPS_URL` | ya | Wajib `https://` valid |
| `NEXT_PUBLIC_BUSINESS_INFO_READY` | ya | `true`/`false` |

Tidak ada variabel server-side/rahasia saat ini. Jika nanti ditambahkan,
**jangan** memakai prefix `NEXT_PUBLIC_` untuk nilai rahasia.

## 6. Jika Fitur Admin/Pesanan Server Ditambahkan

Minimum sebelum rilis: autentikasi server-side di setiap route/API/server action;
otorisasi deny-by-default; Zod (atau setara) untuk validasi input; batas ukuran
body & waktu proses; rate limit login/order dengan store bersama + 429; CSRF untuk
operasi ber-cookie; cookie `Secure`/`HttpOnly`/`SameSite`; hitung ulang harga di
server; idempotency key untuk pembuatan pesanan; jangan simpan data kartu —
gunakan hosted checkout penyedia pembayaran.

## 7. Sisa Risiko yang Diterima

- CSP masih memuat `'unsafe-inline'` untuk `script-src`/`style-src` karena output
  statis Next.js menyisipkan skrip bootstrap inline dan style `next/font`.
  Menghapusnya memerlukan nonce via middleware (menambah runtime, menurunkan
  cache statis) atau hash; dievaluasi ulang jika kebutuhan meningkat.
- Perlindungan DDoS/bot bergantung penuh pada langkah infrastruktur bagian 4.
- Advisory dev-only T-5 belum ada jalur perbaikan yang aman.
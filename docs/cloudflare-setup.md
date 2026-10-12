# Panduan Setup Cloudflare — SMILJAN Kopi Shop

Panduan ini membuat situs berjalan di belakang Cloudflare untuk mendapat
proteksi DDoS, WAF, bot challenge, dan caching. **Semua langkah di dokumen ini
dilakukan oleh manusia di dashboard Cloudflare** — tidak ada bagian yang bisa
diaktifkan dari kode, dan tidak ada langkah di sini yang boleh dijalankan tanpa
akses resmi ke akun.

> **Sebelum mulai — prasyarat**
> - Domain nyata sudah aktif (contoh: `smiljan.id`) dan Anda punya akses ke registrar DNS.
> - Situs sudah dideploy dan bisa diakses langsung lewat HTTPS.
> - MFA aktif di akun Cloudflare dan registrar.
> - **Catat nilai nameserver lama** (dan screenshot konfigurasi DNS) sebagai rencana rollback.
>
> Jangan ubah DNS produksi tanpa otorisasi pemilik domain.

## 1. Pilih Skenario

| Skenario | Cara |
|---|---|
| **A. Cloudflare sebagai proxy di depan origin** (Vercel, Netlify, VPS, Node) — paling umum | Ikuti bagian 2–8 |
| **B. Deploy penuh ke Cloudflare Workers/Pages** | Perlu migrasi ke adapter `@opennextjs/cloudflare`; di luar cakupan dokumen ini |

Dokumen ini fokus pada skenario A.

## 2. Onboarding Domain

1. Buat akun/login ke Cloudflare → **Add a site** → masukkan domain → pilih plan
   (Free sudah memberikan DDoS mitigation dasar + WAF terbatas).
2. Cloudflare memindai DNS yang ada. **Verifikasi setiap record** sebelum lanjut —
   pastikan `A`/`CNAME` situs menunjuk ke origin yang benar.
3. Cloudflare memberi 2 nameserver. Ganti nameserver di registrar domain Anda.
   Propagasi bisa 5 menit–24 jam.
4. Setelah aktif, pastikan record situs berstatus **Proxied** (awan oranye), bukan
   DNS-only (awan abu-abu). Tanpa proxy, tidak ada proteksi.

## 3. SSL/TLS

1. **SSL/TLS → Overview → mode `Full (strict)`.** Jangan pakai `Flexible` —
   tidak aman dan bisa menyebabkan redirect loop (situs kita mengirim HSTS).
2. **SSL/TLS → Edge Certificates:**
   - `Always Use HTTPS`: ON.
   - `Minimum TLS Version`: TLS 1.2.
   - `TLS 1.3`: ON.
3. **HSTS:** aplikasi sudah mengirim `Strict-Transport-Security: max-age=31536000`.
   Setelah **semua subdomain dipastikan HTTPS**, aktifkan HSTS di Cloudflare
   dengan `includeSubDomains` + `preload` bila diinginkan. Jika belum yakin,
   biarkan pengaturan HSTS Cloudflare OFF dan cukup andalkan header dari aplikasi.

## 4. WAF (Web Application Firewall)

1. **Security → WAF → Managed rules:** aktifkan **Cloudflare Managed Ruleset**
   dan **OWASP Core Ruleset** (ketersediaan tergantung plan).
2. Mulai dengan aksi **Managed Challenge** atau **Log** untuk beberapa hari,
   tinjau **Security Events**, lalu naikkan ke Block untuk aturan yang jelas berbahaya.
3. Jangan aktifkan challenge untuk semua pengunjung — situs ini hanya berisi
   halaman publik, jadi challenge massal hanya mengganggu pelanggan.

## 5. Bot Protection

1. **Security → Bots:** aktifkan **Bot Fight Mode** (Free) atau **Super Bot Fight
   Mode** (plan lebih tinggi).
2. Untuk insiden: **Under Attack Mode** boleh dinyalakan sementara, lalu
   **matikan lagi** setelah trafik normal.

## 6. Rate Limiting

Karena situs tidak punya endpoint dinamis/form, rate limit cukup di edge:

1. **Security → Rate limiting rules** (ketersediaan bergantung plan — jika tidak
   ada, kombinasikan Bot Fight Mode + WAF).
2. Contoh aturan kasar untuk seluruh situs:
   - Jika: `http.request.uri.path` cocok `/*`
   - Lalu: lebih dari **300 permintaan per 1 menit per IP**
   - Aksi: **Managed Challenge** (bukan Block, agar pelanggan wajar tidak terkena).
3. Jika nanti ada endpoint sensitif (`/api/*`, form, login), buat aturan lebih
   ketat khusus jalur itu. Kembalikan/arahkan ke respons 429 saat melebihi batas.
4. Mulai longgar, tinjau grafik, dan sesuaikan. Batas yang terlalu ketat akan
   memblokir pelanggan sungguhan.

## 7. Caching

1. **Caching → Cache Rules**, buat aturan:
   - `http.request.uri.path` cocok `/_next/static/*` → **Eligible for cache**,
     Edge TTL long (aset Next.js immutable).
   - `http.request.uri.path` cocok `/images/*` → **Eligible for cache**.
2. Opsional untuk HTML: aturan kedua dengan **Cache Everything** dan Edge TTL
   `Respect origin` (Next.js mengirim `s-maxage=31536000` untuk halaman statis).
   Cache HTML menurunkan beban origin saat lonjakan trafik; matikan jika Anda
   butuh data analytics per-request.
3. Biarkan **Development Mode** OFF di produksi.

## 8. Kunci Origin (Penting)

Tanpa langkah ini, penyerang bisa melewati Cloudflare dengan menembak IP origin
langsung. Pilih salah satu:

- **Authenticated Origin Pulls (mTLS):** Cloudflare → SSL/TLS → Origin Server →
  aktifkan Authenticated Origin Pulls, lalu konfigurasikan server origin untuk
  memverifikasi sertifikat klien Cloudflare. Cek dokumentasi Cloudflare apakah
  plan Anda mendukung mode yang dibutuhkan.
- **Allowlist IP Cloudflare di firewall origin:** blokir semua trafik ke origin
  kecuali dari [daftar IP resmi Cloudflare](https://www.cloudflare.com/ips/).
  Untuk VPS ini paling praktis (iptables/ufw/security group cloud).
- **Vercel/Netlify:** origin dikelola platform. Alternatif: gunakan firewall
  bawaan Vercel/Netlify dan pertimbangkan tidak memakai Cloudflare di depan
  (dua lapisan proxy bisa menambah kompleksitas, mis. IP asli pengunjung).
  Jika tetap memakai Cloudflare, pastikan domain kustom diarahkan dengan benar
  dan aktifkan proteksi deployment/preview platform.

Verifikasi setelah dikunci: akses langsung ke IP origin harus gagal atau
ditolak (lihat bagian 9).

## 9. Verifikasi (dari komputer Anda)

```bash
# 1. Header keamanan + deteksi Cloudflare
npm run verify:headers -- https://domain-anda.com

# 2. Header cf-ray harus muncul (bukti lewat Cloudflare)
curl.exe -sI https://domain-anda.com | findstr /I "cf-ray server"

# 3. Origin tidak boleh bisa diakses langsung (ganti dengan IP origin Anda)
curl.exe -sI https://203.0.113.10 -H "Host: domain-anda.com"
#    Harapan: koneksi ditolak/403. Jika balas 200, origin masih terbuka.
```

`npm run verify:headers` memeriksa CSP, HSTS, nosniff, frame protection,
referrer/permissions policy, kebocoran `X-Powered-By`, redirect HTTP→HTTPS, dan
memberi peringatan jika Cloudflare tidak terdeteksi.

## 10. Analytics Tanpa Cookie (Sudah Diaktifkan di Kode)

Cloudflare Web Analytics tidak memakai cookie, jadi **tidak perlu banner
persetujuan**. Implementasinya sudah ada di kode: `CloudflareAnalytics`
(`src/components/analytics/CloudflareAnalytics.tsx`) hanya memuat beacon jika
environment `NEXT_PUBLIC_CF_BEACON_TOKEN` diisi. CSP di `next.config.ts` sudah
mengizinkan `static.cloudflareinsights.com` (script) dan
`cloudflareinsights.com` (connect).

Langkah Anda:

1. Cloudflare → **Analytics & Logs → Web Analytics → Add a site**.
2. Pilih mode **JS snippet** (bukan injeksi otomatis) → salin token dari
   snippet `beacon.min.js` (`data-cf-beacon='{"token": "..."}'`).
3. Set `NEXT_PUBLIC_CF_BEACON_TOKEN=<token>` di environment hosting, lalu
   deploy ulang. Biarkan kosong untuk menonaktifkan analytics sepenuhnya.
4. Verifikasi: DevTools → Network harus ada `beacon.min.js` (status 200) dan
   console bersih dari error CSP; data muncul di dashboard setelah ada trafik.

> Jangan aktifkan dua mode sekaligus: jika Cloudflare menyuntik beacon otomatis
> sementara snippet manual juga aktif, kunjungan akan tercatat dobel.
>
> Selama token kosong (termasuk saat tes otomatis), tidak ada satu pun request
> analytics dan tidak ada cookie — dijamin oleh `e2e/analytics.spec.ts`.

## 11. Notifikasi & Monitoring

Aktifkan **Notifications** untuk: lonjakan trafik (traffic spike), lonjakan
error 5xx, dan security events WAF. Aktifkan juga alert billing/usage jika plan
berbayar.

## 12. Rollback

1. **Jeda cepat:** Cloudflare → DNS → **Pause Cloudflare** (record jadi DNS-only,
   trafik kembali langsung ke origin).
2. **Kembalikan permanen:** ganti nameserver di registrar ke nilai lama yang
   sudah Anda catat di awal.
3. Jika ada aturan WAF/rate limit yang salah blokir, nonaktifkan aturan itu satu
   per satu dari **Security Events** untuk melihat aturan mana yang memicu.

## 13. Yang Tidak Bisa Dilakukan dari Kode

- Mengaktifkan proxy/WAF/rate limit Cloudflare — **wajib dashboard**.
- Mengunci origin — **wajib konfigurasi firewall/SSL origin**.
- Menjamin situs "kebal DDoS" — tidak ada jaminan seperti itu; proteksi edge
  hanya mengurangi dampak, tidak menghilangkan risiko.

Kembali ke [SECURITY.md](../SECURITY.md) untuk ringkasan audit keamanan.
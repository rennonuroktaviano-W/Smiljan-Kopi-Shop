# Product Requirements Document (PRD)
# Smiljan Kopi Shop — Editorial & Minimal Website

- **Dokumen:** Product Requirements Document
- **Produk:** Smiljan Kopi Shop
- **Versi:** 1.0
- **Status:** Implementasi selesai (menunggu data pemilik final)
- **Tanggal:** 11 Oktober 2026
- **Bahasa produk:** Bahasa Indonesia (copy brand telah disetujui pemilik)
- **Repository GitHub:** `https://github.com/rennonuroktaviano-W/Smiljan-Kopi-Shop.git`

> **Catatan:** Dokumen ini memuat kebutuhan dan kriteria penerimaan. Setiap klaim (kode jadi, pengujian lulus, atau push berhasil) baru dapat dianggap benar setelah diverifikasi langsung di repository dan Git.

---

## 1. Ringkasan Produk

Smiljan Kopi Shop adalah website resmi untuk bisnis coffee shop dengan arah visual **Modern Specialty Coffee — Editorial & Minimal**. Website harus terasa premium, tenang, kontemporer, dan berorientasi pada fotografi produk, tipografi editorial, whitespace, serta interaksi yang halus.

Website berfungsi sebagai:
1. Identitas digital dan company profile Smiljan.
2. Katalog menu yang mudah dilihat dan dipahami.
3. Kanal untuk mengarahkan pengunjung melakukan pemesanan melalui WhatsApp.
4. Sumber informasi lokasi, jam operasional, dan kontak bisnis.

Versi awal berfokus pada frontend yang cepat, responsif, mudah dipelihara, dan tidak membutuhkan backend/database kecuali kebutuhan baru disetujui.

## 2. Tujuan dan Metrik Keberhasilan

### Tujuan
- Menyampaikan identitas visual Smiljan secara konsisten.
- Membantu pelanggan menemukan menu, harga, lokasi, jam buka, dan kontak.
- Mengurangi hambatan dari melihat produk sampai memulai pemesanan.
- Menyediakan fondasi teknis yang bersih untuk fitur lanjutan.

### Metrik dan kriteria keberhasilan
- Semua halaman utama dapat dibuka langsung melalui URL dan navigasi internal.
- Semua CTA utama berfungsi dan tidak ada tombol dekoratif tanpa aksi.
- Menu dan informasi bisnis berasal dari satu sumber data yang mudah diperbarui.
- Layout tidak menimbulkan horizontal overflow pada viewport yang diuji.
- Tidak ada error build, lint, TypeScript, atau runtime yang diketahui pada pemeriksaan akhir.
- Pesan WhatsApp tersusun dengan benar berdasarkan produk yang dipilih.
- Gambar memiliki alternatif teks yang sesuai dan kontrol interaktif dapat diakses melalui keyboard.
- Core Web Vitals dan Lighthouse ditargetkan baik, tetapi skor hanya boleh dilaporkan setelah pengujian nyata.

## 3. Target Pengguna dan Kebutuhan

### Persona A — Calon pelanggan
Perlu memahami karakter coffee shop, melihat produk dan harga, serta mengetahui cara memesan atau berkunjung.

### Persona B — Pelanggan yang sudah mengenal Smiljan
Perlu menemukan menu, jam buka, alamat, dan kontak dengan cepat, terutama melalui ponsel.

### Persona C — Pemilik/staf
Perlu memperbarui daftar menu, harga, deskripsi, dan informasi bisnis tanpa harus mengubah banyak komponen UI.

## 4. Batasan Scope

### Termasuk dalam versi pertama
- Homepage.
- Halaman menu dengan kategori dan kartu produk.
- Halaman cerita brand.
- Halaman lokasi/kunjungan.
- Pemesanan yang diarahkan ke WhatsApp.
- Responsive design, SEO dasar, aksesibilitas dasar, optimasi aset, dan dokumentasi setup.
- Data menu terpusat dalam file lokal.
- Pengujian build, lint, tipe, dan alur penting.

### Tidak termasuk kecuali disetujui sebagai pekerjaan tambahan
- Payment gateway dan checkout berbayar.
- Akun pelanggan, login, membership, dan loyalty.
- Admin dashboard/CMS.
- Database, inventori real-time, dan sinkronisasi POS.
- Reservasi meja online.
- Multi-cabang dan multi-bahasa penuh.
- Klaim tentang asal biji, sertifikasi, sustainability, atau proses roasting yang belum diverifikasi.

Informasi bisnis yang belum diberikan ditandai jelas sebagai belum final (misalnya "segara hadir"). Jangan mengarang alamat, nomor WhatsApp, jam operasional, akun media sosial, sejarah bisnis, harga, atau klaim produk.

## 5. Stack dan Aturan Implementasi

### Stack yang diminta
- **Next.js** dengan App Router.
- **HTML semantik** melalui JSX/TSX.
- **CSS** melalui Tailwind CSS.
- **JavaScript/TypeScript** untuk perilaku interaktif; gunakan JavaScript vanilla dalam Client Components jika memungkinkan dan sesuai kebutuhan.
- Gunakan TypeScript jika template proyek dan konfigurasi mendukungnya. Jangan mencampur file `.js`, `.jsx`, `.ts`, dan `.tsx` secara acak.
- Gunakan package manager yang sudah dipakai repository. Jika belum ada, pilih satu dan konsisten, lalu commit lockfile.
- Gunakan versi dependency yang kompatibel dan stabil sesuai environment; jangan memperbarui dependency secara massal tanpa alasan.

### Aturan Next.js
- Gunakan App Router.
- Utamakan Server Components untuk konten statis.
- Tambahkan `"use client"` hanya pada komponen yang memerlukan state, event browser, atau animasi interaktif.
- Jangan menggunakan `useEffect` untuk konten yang dapat dirender secara statis.
- Gunakan `next/image` untuk aset lokal/remote yang dikonfigurasi dengan benar; jika menggunakan remote image, konfigurasi domain harus eksplisit.
- Hindari hydration mismatch, penggunaan browser API saat server render, dan nested interactive elements.
- Gunakan metadata API Next.js untuk metadata per halaman.

### Aturan kode
- Komponen kecil, bertanggung jawab jelas, dan dapat digunakan kembali.
- Pisahkan data bisnis dari presentasi UI.
- Hindari duplikasi navigasi, footer, button, dan product card.
- Jangan membuat link atau tombol yang tidak memiliki aksi.
- Jangan meninggalkan `TODO` atau error yang tidak dijelaskan pada area yang dinyatakan selesai.
- Jangan menyimpan secret, token, password, atau kredensial di repository.
- Jangan menonaktifkan lint/type checks hanya untuk membuat build lolos.
- Jangan menambahkan dependency besar untuk efek sederhana yang dapat dibuat dengan CSS.

## 6. Informasi Brand dan Design System

### Brand
- Nama tampilan: **SMILJAN**
- Descriptor: **KOPI SHOP**
- Positioning visual: modern specialty coffee, editorial, minimal.
- Tagline (disetujui): **“Kopi Baik, Hari Baik.”**
- Headline (disetujui): **“Kopi Pelan, Hari Tenang.”**
- Copy hero (disetujui): “Kopi diracik satu per satu, tanpa terburu-buru.”

Copy versi 1 di atas telah disetujui pemilik dan boleh direvisi kemudian. Jangan menyiratkan klaim produk atau bisnis yang belum dikonfirmasi.

### Palet warna
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-obsidian` | `#111111` | Hero gelap, footer, teks utama di area terang |
| `--color-ivory` | `#F5F3EE` | Background utama dan area konten terang |
| `--color-stone` | `#DCD8CE` | Border, divider, bidang sekunder |
| `--color-olive` | `#858675` | Aksen minor dan label |
| `--color-graphite` | `#6B6B67` | Teks sekunder di atas background terang |
| `--color-white` | `#FFFFFF` | Surface/kartu tertentu jika dibutuhkan |

- Ivory dan obsidian merupakan warna dominan.
- Olive digunakan secukupnya, bukan sebagai warna CTA utama tanpa pengujian kontras.
- Pastikan kontras teks memenuhi WCAG 2.2 AA sedapat mungkin: 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
- Jangan menggunakan teks graphite di background gelap jika kontrasnya tidak cukup; sediakan token teks sekunder khusus dark surface.

### Tipografi
- **Display/headline:** Playfair Display atau serif alternatif yang disetujui.
- **Body/UI:** Manrope atau sans-serif alternatif yang disetujui.
- Utamakan pemuatan font lokal/optimized font melalui fasilitas Next.js jika tersedia.
- Hindari layout shift akibat font swap; gunakan fallback yang serupa dan strategi preload seperlunya.
- Skala tipografi responsif dengan `clamp()` atau breakpoint Tailwind.

| Elemen | Desktop (panduan) | Mobile (panduan) |
|---|---:|---:|
| Hero heading | 76–104 px | 42–58 px |
| Section heading | 44–64 px | 32–42 px |
| Subheading | 22–28 px | 20–24 px |
| Body | 15–17 px | 14–16 px |
| UI label | 11–13 px | 11–13 px |
| Product price | 14–16 px | 14–16 px |

Ukuran final perlu divalidasi pada berbagai lebar viewport. Hindari heading yang terpotong atau overflow.

### Grid, spacing, dan bentuk
- Gunakan container terpusat dengan max-width yang konsisten (misalnya 1280–1440 px).
- Desktop: grid 12 kolom atau sistem grid yang konsisten.
- Tablet: grid 6–8 kolom sesuai kebutuhan.
- Mobile: satu kolom untuk section editorial; 2 kolom produk hanya jika kartu tetap terbaca.
- Spacing berdasarkan skala konsisten (misalnya kelipatan 4 atau 8 px).
- Border tipis, radius kecil hingga sedang, dan shadow minimal.
- Whitespace harus terasa disengaja; hindari terlalu banyak kartu berbingkai.

## 7. Struktur Informasi dan Routing

| Route | Tujuan | Konten utama |
|---|---|---|
| `/` | Homepage | Hero, signature menu, philosophy, visit, CTA |
| `/menu` | Katalog produk | Kategori, kartu produk, harga, order action |
| `/our-story` | Cerita brand | Filosofi, narasi, foto, nilai brand yang terverifikasi |
| `/visit` | Informasi lokasi | Alamat, jam buka, kontak, map/directions |

Jika jumlah konten belum cukup, halaman story dapat menggunakan layout ringkas tetapi route tetap konsisten. Semua route harus dapat diakses melalui navigasi dan direct URL.

## 8. Spesifikasi UI Homepage

### 8.1 Header / Navigation
**Desktop**
- Logo “SMILJAN” dan descriptor “KOPI SHOP”.
- Navigasi: Beranda, Menu, Tentang Kami, Kunjungi.
- CTA “Pesan Kopi” atau label serupa.
- Posisi awal dapat transparan di atas hero; setelah scroll, background solid dengan kontras memadai.
- Header sticky hanya jika tidak mengganggu ruang baca atau mobile.

**Mobile**
- Logo di kiri dan tombol menu di kanan.
- Menu mobile berupa drawer/panel yang mudah ditutup, memiliki focus management, dan mendukung Escape.
- Kunci scroll body saat drawer terbuka hanya jika implementasi benar-benar menangani cleanup.
- Navigasi tidak boleh menutupi konten atau CTA penting.

**Acceptance criteria**
- Semua link mengarah ke route yang benar.
- Status aktif/hover/focus jelas.
- Menu dapat dioperasikan dengan keyboard.
- Tidak ada layout shift saat header berubah.

### 8.2 Hero
- Section pembuka dengan background obsidian atau fotografi gelap berkualitas.
- Eyebrow: `KOPI PILIHAN`.
- Headline: `Kopi Pelan, Hari Tenang.`
- Supporting copy pendek, maksimal sekitar 2–3 baris pada desktop.
- Primary CTA: `Lihat Menu`.
- Secondary CTA: `Tentang Kami`.
- Foto hero: close-up espresso, barista, atau produk yang benar-benar mewakili Smiljan.
- Berikan overlay yang cukup untuk keterbacaan teks.
- Elemen tambahan seperti scroll indicator bersifat opsional dan tidak boleh menghalangi akses.

**Acceptance criteria**
- Hero menampilkan headline, copy, dan CTA pada semua ukuran.
- Foto memiliki crop yang tepat di portrait dan landscape.
- CTA menu bekerja.
- Konten penting tidak hanya disampaikan melalui gambar.
- Tidak ada animasi yang menunda akses ke konten utama.

### 8.3 Signature Menu
- Judul: `Andalan Kami.`
- Tampilkan 3–4 produk unggulan yang dikonfirmasi pemilik.
- Kartu terdiri atas foto, nama, deskripsi singkat, harga IDR, dan link/tombol aksi.
- Rasio gambar konsisten, misalnya 4:5 atau 1:1.
- Hover desktop: scale foto kecil, transisi sekitar 250–350 ms.
- Mobile tidak bergantung pada hover.
- CTA `Lihat Menu Lengkap`.

**Acceptance criteria**
- Produk dan harga berasal dari data terpusat.
- Format harga konsisten menggunakan IDR.
- Gambar memiliki alt text yang deskriptif.
- Kartu tidak mengandung nested links/buttons yang tidak valid.

### 8.4 Philosophy / Brand Story
- Judul: `Kami Tidak Terburu-buru.`
- Layout editorial asimetris: foto dan teks dengan proporsi seimbang.
- Narasi singkat tentang brand dan pengalaman yang ingin diciptakan.
- CTA ke `/our-story`.
- Gunakan hanya fakta yang diberikan atau disetujui pemilik.

### 8.5 Editorial Break (opsional)
- Foto detail biji kopi, proses brewing, atau tekstur interior.
- Headline singkat: `Setiap Cangkir Punya Ceritanya.`
- Hapus section ini jika konten kurang atau hanya mengulang pesan yang sama.

### 8.6 Visit Section
- Judul: `Singgah untuk Ngopi.`
- Alamat, jam buka, kontak, dan tautan directions.
- Foto interior jika tersedia.
- Embed peta hanya jika lokasi terverifikasi dan dampak performa dapat diterima; jika tidak, gunakan link directions.
- Jangan menebak koordinat atau alamat.

### 8.7 Footer
- Logo dan tagline yang disetujui.
- Link halaman utama.
- Link sosial dan kontak hanya jika URL/nomor valid sudah disediakan.
- Copyright dengan tahun otomatis.
- Privacy policy hanya jika relevan dan isi benar-benar tersedia; jangan membuat tautan mati.

## 9. Spesifikasi Halaman Menu

### Layout
- Page title: `Menu Kami`.
- Deskripsi singkat.
- Filter kategori: `All`, `Coffee`, `Non-Coffee`, `Food` sesuai kategori yang benar-benar tersedia.
- Grid responsif.
- Setiap kartu memiliki foto, nama, deskripsi, harga, dan aksi order.
- Empty state jika filter tidak menghasilkan produk.
- Filter bekerja dengan keyboard dan memiliki indikator kategori aktif.

### Data produk
Buat tipe/model produk dengan field minimum:
- `id`: unik dan stabil.
- `name`: nama produk.
- `description`: deskripsi singkat.
- `price`: integer dalam rupiah.
- `category`: kategori yang tervalidasi.
- `image`: path lokal atau URL tepercaya.
- `imageAlt`: deskripsi gambar.
- `featured`: boolean opsional.
- `available`: boolean untuk ketersediaan jika dibutuhkan.

Simpan data pada modul terpusat, misalnya `src/data/menu.ts`. Jangan menyebar nama dan harga yang sama di beberapa file.

### Pemesanan WhatsApp
- Nomor tujuan harus berupa konfigurasi yang diberikan pemilik dalam format internasional tanpa tanda `+`, spasi, atau tanda hubung.
- Jangan mengarang nomor. Jika belum diberikan, tampilkan CTA nonaktif berlabel "segara hadir"; jangan menghasilkan link yang salah.
- Bangun pesan menggunakan `URLSearchParams` atau encoding yang benar.
- Pesan harus mencantumkan nama produk dan informasi yang benar.
- Buka link eksternal dengan perilaku aman.
- Jika order memiliki beberapa item, jumlah dan ringkasan harus dihitung secara akurat.
- Tampilkan pesan yang jelas bila pemesanan belum dapat dilakukan.

Contoh isi pesan (nomor dan produk berikut belum final):
`Halo Smiljan, saya ingin memesan:\n1. [nama produk]\nMohon info ketersediaannya.`

Keranjang lokal sederhana boleh ditambahkan hanya jika memang disepakati dalam scope. Jangan mengklaim pesanan telah diterima sebelum pelanggan mengirim pesan dan bisnis mengonfirmasi.

## 10. Spesifikasi Tentang Kami

- Hero dengan judul editorial.
- Narasi brand yang disetujui pemilik.
- Foto proses atau ruang coffee shop.
- Nilai dan filosofi bisnis, hanya jika faktual.
- CTA menuju menu atau lokasi.
- Gunakan hierarki heading semantik (`h1`, `h2`, `h3`) dan paragraf yang mudah dibaca.

## 11. Spesifikasi Kunjungi

- Headline dan pengantar singkat.
- Alamat lengkap yang terverifikasi.
- Jam operasional dengan hari dan zona waktu yang jelas.
- Nomor kontak/WhatsApp yang valid.
- Link Google Maps/directions yang valid.
- Foto interior/eksterior jika tersedia.
- Jika data belum diberikan, tandai dengan jelas sebagai belum final dan jangan menampilkannya sebagai informasi faktual.

## 12. Motion Design

Animasi mendukung isi, bukan mendominasi pengalaman.

| Komponen | Motion | Durasi awal |
|---|---|---:|
| Hero text | Fade + translate Y kecil | 600–900 ms |
| Hero image | Opacity/clip reveal sederhana | 700–1000 ms |
| Section | Fade-up ketika masuk viewport | 400–600 ms |
| Product image | Scale kecil pada hover | 250–350 ms |
| Header | Background/color transition | 200–300 ms |
| Page transition | Fade singkat jika stabil | 150–250 ms |

### Ketentuan
- Pilih easing yang lembut dan konsisten.
- Jangan memakai animasi yang menyebabkan horizontal overflow.
- Hormati `prefers-reduced-motion: reduce`; hilangkan atau sederhanakan gerakan non-esensial.
- Pastikan konten tetap terlihat bila JavaScript animasi gagal.
- Hindari animasi layout yang mahal; utamakan `transform` dan `opacity`.
- Jangan menambahkan smooth-scroll global yang menghalangi navigasi keyboard atau perilaku browser.
- Uji animasi pada perangkat mobile dengan performa terbatas.

## 13. Responsive Design untuk Semua Perangkat

### Target pengujian
Setidaknya uji viewport:
- 320 × 568 (ponsel kecil)
- 360 × 800
- 390 × 844
- 430 × 932
- 768 × 1024 (tablet portrait)
- 1024 × 768 (tablet/landscape)
- 1280 × 800 (laptop)
- 1440 × 900 (desktop)
- 1920 × 1080 (desktop lebar)

### Perilaku layout
**Mobile, di bawah 768 px**
- Navigation menjadi menu ringkas.
- Hero stack vertikal; headline tidak terpotong.
- CTA memiliki target sentuh sekitar 44 × 44 px atau lebih.
- Product grid 1–2 kolom tergantung lebar dan keterbacaan.
- Padding horizontal sekitar 20–24 px sebagai titik awal.
- Foto menggunakan crop portrait atau landscape yang sesuai.

**Tablet, 768–1023 px**
- Header menyesuaikan lebar, tidak memaksakan seluruh elemen desktop.
- Grid produk 2–3 kolom.
- Section asimetris dapat berubah menjadi 2 kolom seimbang atau stack.

**Laptop/desktop, 1024 px ke atas**
- Container terpusat dengan lebar maksimum yang konsisten.
- Grid produk 3–4 kolom.
- Hero memanfaatkan ruang horizontal tanpa membuat teks terlalu panjang.
- Whitespace meningkat secara proporsional, tidak tanpa batas.

### Acceptance criteria responsive
- Tidak ada horizontal scrolling yang tidak disengaja pada semua viewport target.
- Tidak ada teks, tombol, atau harga yang tertutup/terpotong.
- Header, drawer, filter, dan CTA tetap dapat digunakan dengan sentuhan dan keyboard.
- Layout bekerja pada portrait dan landscape.
- Tidak ada fitur penting yang hanya dapat diakses lewat hover.
- Semua gambar menggunakan ukuran/crop responsif.
- Uji juga zoom browser 200% dan ukuran font sistem yang lebih besar jika memungkinkan.

## 14. Accessibility

Target: WCAG 2.2 AA sebagai sasaran desain dan pengujian.

- Struktur HTML semantik dan landmark yang benar.
- Setiap halaman memiliki satu `h1` utama yang jelas.
- Kontras warna teks yang memadai.
- Focus indicator terlihat pada semua kontrol interaktif.
- Semua fungsi dapat diakses menggunakan keyboard.
- Menu mobile memiliki nama aksesibel, state expanded, focus handling, dan dukungan Escape.
- Alt text informatif untuk foto konten; alt kosong untuk gambar dekoratif.
- Form, filter, dan tombol memiliki label aksesibel.
- Tidak mengandalkan warna saja untuk menunjukkan status.
- Hormati preferensi reduced motion.
- Jangan membuat teks kecil sebagai satu-satunya tempat untuk informasi penting.

## 15. SEO, Metadata, dan Social Sharing

- Metadata title dan description yang unik untuk setiap route.
- Metadata dasar site-wide dan Open Graph.
- Favicon dan social sharing image hanya jika aset tersedia.
- URL yang deskriptif dan konsisten.
- Heading semantik, link dengan label yang bermakna, dan internal linking.
- Sitemap dan robots configuration sesuai kebutuhan deployment.
- Local SEO menggunakan nama, alamat, dan nomor telepon hanya setelah data diverifikasi.
- Structured data bisnis lokal hanya jika seluruh properti yang digunakan benar dan dapat diverifikasi.
- Jangan memasukkan alamat sementara atau rating palsu ke metadata/schema.
- Tambahkan canonical URL ketika domain produksi sudah ditentukan.

## 16. Performance dan Optimasi

- Gunakan `next/image` dan tetapkan dimensi/aspect ratio gambar.
- Hero image yang menjadi Largest Contentful Paint dapat diprioritaskan secara terukur; jangan memprioritaskan semua gambar.
- Lazy-load gambar di bawah fold.
- Hindari autoplay video besar; jika digunakan, sediakan poster dan fallback.
- Kurangi dependency, JavaScript client, dan penggunaan state yang tidak perlu.
- Gunakan font yang teroptimasi dan batasi jumlah weight.
- Jangan melakukan fetch berulang untuk data menu statis.
- Hindari layout shift saat font dan gambar dimuat.
- Periksa ukuran bundle dan Lighthouse pada build produksi.
- Target Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 pada persentil ke-75 bila data lapangan tersedia. Jangan klaim angka ini tercapai tanpa pengukuran.

## 17. Security dan Reliability

- Jangan menyimpan kredensial GitHub atau secret lain dalam kode, `.env` yang ter-commit, log, atau dokumentasi.
- `.env.local` harus diabaikan oleh Git; sediakan `.env.example` tanpa nilai rahasia.
- Validasi dan encode input yang masuk ke URL atau pesan.
- Hindari `dangerouslySetInnerHTML` kecuali ada kebutuhan yang jelas dan sanitasi yang sesuai.
- Link eksternal yang membuka tab baru harus menggunakan atribut keamanan yang tepat.
- Jangan membuat form palsu yang tampak sukses tanpa backend.
- Tangani gambar hilang dan data kosong dengan fallback yang masuk akal.
- Gunakan error boundaries atau error states Next.js jika sesuai.
- Jangan menghapus data, menimpa pekerjaan pengguna, atau melakukan force push tanpa izin eksplisit.

## 18. Struktur Repository yang Disarankan

Sesuaikan dengan struktur existing repository; jangan menghapus file penting hanya untuk mencocokkan contoh ini.

```text
smiljan-kopi-shop/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── menu/
│   │   ├── story/
│   │   └── cafe/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── menu/page.tsx
│   │   ├── our-story/page.tsx
│   │   ├── visit/page.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── menu/
│   │   └── ui/
│   ├── data/
│   │   └── menu.ts
│   ├── lib/
│   │   ├── format-currency.ts
│   │   └── whatsapp.ts
│   └── types/
│       └── menu.ts
├── .env.example
├── .gitignore
├── README.md
├── PRD-Smiljan-Kopi-Shop.md
├── package.json
└── lockfile sesuai package manager
```

## 19. Coding Standards dan Konvensi

- Gunakan nama komponen PascalCase.
- Gunakan nama fungsi/variabel camelCase.
- Hindari komponen raksasa; pisahkan jika tanggung jawabnya berbeda.
- Gunakan utility class Tailwind secara konsisten dan ekstrak komponen bila pola berulang.
- Jangan menambahkan custom CSS untuk sesuatu yang dapat ditangani Tailwind secara jelas; custom CSS tetap boleh untuk design tokens, keyframes, dan kebutuhan khusus.
- Hindari arbitrary values berlebihan tanpa alasan.
- Jangan menggunakan index array sebagai key jika data memiliki ID stabil.
- Gunakan format rupiah dengan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })` bila sesuai kebutuhan.
- Periksa link internal, alt text, loading state, empty state, dan error state.
- Dokumentasikan cara menjalankan project dan konfigurasi yang diperlukan.

## 20. Testing dan Quality Gates

Gunakan scripts yang benar-benar tersedia pada `package.json`. Jika belum ada, tambahkan script yang sesuai dengan stack dan konfigurasi project.

### Pemeriksaan wajib sebelum menandai pekerjaan selesai
1. Install dependency menggunakan package manager dan lockfile yang sesuai.
2. Jalankan lint.
3. Jalankan typecheck jika TypeScript digunakan.
4. Jalankan build produksi.
5. Jalankan test otomatis yang tersedia.
6. Smoke-test semua route utama.
7. Uji navigasi dan pemesanan WhatsApp.
8. Uji viewport mobile, tablet, laptop, dan desktop.
9. Periksa browser console dan network errors.
10. Perbaiki semua error yang ditemukan, lalu ulangi pemeriksaan yang relevan.

### Kriteria rilis
- Build produksi sukses.
- Tidak ada lint/type errors yang belum diselesaikan.
- Tidak ada route utama yang menghasilkan 404 atau runtime error.
- Tidak ada tombol utama tanpa fungsi.
- Responsive checks lulus pada daftar viewport.
- Konfigurasi bisnis yang belum lengkap ditandai jelas dan tidak ditampilkan sebagai fakta.
- Semua hasil pemeriksaan dicatat beserta perintah yang dijalankan dan status sebenarnya.

Pernyataan “zero errors” hanya sah setelah pengujian nyata; catat lingkungan dan batasan pengujiannya.

## 21. Alur Kerja Git

Perubahan dikerjakan per satuan kecil yang terverifikasi, lalu di-commit dan di-push satu per satu.

Jika remote `origin` belum ada:
```bash
git remote add origin https://github.com/rennonuroktaviano-W/Smiljan-Kopi-Shop.git
```

Sebelum mengubah remote, periksa dulu kondisinya:
```bash
git remote -v
git status --short --branch
git branch --show-current
```

Jika `origin` sudah ada dengan URL lain, jangan menggantinya tanpa meninjau repository dan mendapat persetujuan bila ada risiko.

Alur tiap langkah:
1. Periksa status dan branch Git.
2. Kerjakan satu unit perubahan yang terfokus.
3. Jalankan lint, typecheck, test, dan build yang relevan.
4. Tinjau diff dan jalankan `git diff --check`.
5. Stage hanya file yang terkait.
6. Commit dengan pesan yang jelas (contoh: `feat: implement responsive homepage`).
7. Push ke branch yang benar.
8. Verifikasi hasil push dan catat hash commitnya.
9. Baru perbarui checklist PRD setelah pekerjaan dan verifikasi benar-benar selesai.

Aturan Git:
- Jangan memakai `git push --force` / `--force-with-lease`, `git reset --hard`, menghapus branch, atau menimpa perubahan pengguna.
- Jangan stage semua file secara sembarangan bila ada perubahan sensitif atau tidak terkait.
- Jangan commit `.env.local`, token, kredensial, artefak build, atau `node_modules`.
- Satu commit per langkah; boleh lebih bila satu satuan perlu dipecah demi keamanan/kualitas.
- Push ditolak (branch protection, conflict, autentikasi, jaringan) → laporkan kendala, jangan mengaku berhasil.
- Autentikasi lewat mekanisme Git yang tersedia; jangan menyuruh pengguna menempelkan token atau password di chat.
- Bila push tidak memungkinkan, berikan commit/status yang benar dan instruksi lanjutan, bukan klaim palsu.

### Checklist proyek
Checklist berikut harus diperbarui seiring implementasi. Todo baru boleh dicentang setelah selesai, diuji, dan di-push jika push memungkinkan.

- [x] Audit repository, branch, remote, scripts, dan status working tree.
- [x] Siapkan fondasi Next.js/Tailwind dan design tokens.
- [x] Implementasi shared layout, navbar, dan footer.
- [x] Implementasi hero homepage.
- [x] Implementasi signature menu dan sumber data produk.
- [x] Implementasi philosophy/story section.
- [x] Implementasi visit section.
- [x] Implementasi halaman menu dan kategori.
- [x] Implementasi halaman Tentang Kami.
- [x] Implementasi halaman Kunjungi.
- [x] Implementasi WhatsApp ordering.
- [x] Implementasi responsive behavior seluruh halaman.
- [x] Implementasi motion dan reduced-motion behavior.
- [x] Implementasi SEO dan metadata.
- [x] Implementasi accessibility dan error states.
- [x] Jalankan quality gates dan perbaiki temuan.
- [x] Perbarui README dan konfigurasi contoh.
- [x] Verifikasi semua commit dan push ke GitHub.

### Hasil pemeriksaan nyata (11 Oktober 2026)

- **Lint/typecheck/build:** 0 error / 0 error / sukses (6 route static).
- **Playwright (Chromium):** `npm run test:e2e` 29/29 lulus; `npm run test:e2e:whatsapp` (nomor uji, build terpisah) 2/2 lulus. Mencakup: status 200 semua route, satu `h1`, alt text, skip-link, filter keyboard, drawer mobile + Escape, reduced-motion, tidak ada console/page/network error (termasuk favicon), tidak ada overflow horizontal di 9 viewport §13 + zoom 200%, alur WhatsApp aktif/nonaktif.
- **Lighthouse (build produksi):** `/` dan `/menu` → Accessibility 100, Best Practices 100, SEO 100, CLS 0; Performance 92–94 (LCP lab ~2.9 s, TBT 160–240 ms). Field data CWV belum ada (belum produksi); target LCP ≤ 2.5 s tidak diklaim (§2/§16).
- **Blocker tersisa:** data pemilik belum tersedia (menu/harga, nomor WhatsApp, alamat, jam buka, foto). Semua masih versi awal berlabel “segara hadir” sesuai §9/§11/§24.

## 22. Cara Mengerjakan Proyek Ini

Sebelum mengubah kode:

1. Audit repository, status Git, branch, remote, framework, dependency, dan scripts yang ada; pertahankan pekerjaan yang sudah berjalan.
2. Susun rencana kerja menjadi todo kecil, berurutan, dan dapat diverifikasi.
3. Kerjakan satu per satu, bukan membangun seluruh proyek tanpa struktur.
4. Setiap todo rampung → jalankan pemeriksaan relevan, tinjau diff, lalu commit dan push sesuai bagian 21.
5. Perbarui checklist PRD dan catat hash commit serta hasil push yang nyata.
6. Bila data bisnis belum tersedia, tandai sebagai belum final dan catat pertanyaan untuk pemilik; jangan mengarang fakta.
7. Fitur tidak dianggap selesai jika hanya mockup statis padahal requirement meminta interaksi.
8. Testing, deployment, atau push baru dinyatakan berhasil setelah hasilnya benar-benar terlihat.
9. Blocker (akses repo, install dependency, autentikasi, branch protection) dijelaskan; kerjakan hanya bagian yang aman.
10. Sebelum rilis, jalankan seluruh quality gates dan cek responsive di viewport yang ditentukan.

## 23. Info yang Diharapkan dari Pemilik

Sebelum launch produksi, minta konfirmasi dari pemilik:
- Logo resmi dan aset brand.
- Foto asli produk, barista, dan interior.
- Daftar menu, deskripsi, kategori, harga, serta ketersediaan.
- Nomor WhatsApp pemesanan.
- Alamat, jam operasional, dan URL Google Maps.
- Link Instagram/TikTok atau sosial media lain.
- Tagline dan copy brand yang disetujui.
- Domain produksi.
- Kebutuhan CMS/admin dashboard pada fase berikutnya (opsional).

## 24. Definisi Selesai

Project dapat dinyatakan siap rilis setelah:
- Semua route dan fitur yang disepakati selesai.
- Konten bisnis telah diverifikasi.
- Responsiveness dan aksesibilitas telah diuji.
- Lint, typecheck, test yang tersedia, dan production build berhasil.
- Tidak ada bug kritis yang diketahui.
- README dan konfigurasi contoh lengkap.
- Perubahan ter-commit dan push berhasil diverifikasi pada repository/branch yang benar.
- Laporan akhir mencantumkan fitur selesai, hasil pemeriksaan, commit/hash, status push, dan blocker yang masih tersisa.

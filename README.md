# SMILJAN Kopi Shop

Website editorial & minimal untuk **SMILJAN Kopi Shop** — "Good Coffee. Better Days."

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
npm run dev        # development server
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npm run typecheck  # TypeScript type check
```

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

Variabel `NEXT_PUBLIC_*` dibaca oleh `src/data/site.ts`. Selama data belum diverifikasi pemilik:

- CTA WhatsApp/pemesanan tampil sebagai tombol nonaktif dengan keterangan jelas (tidak mengirim link `wa.me` tanpa nomor).
- Halaman menu/kunjungan menampilkan catatan `DevNotice` bahwa data masih placeholder.
- `NEXT_PUBLIC_BUSINESS_INFO_READY=true` hanya setelah seluruh data bisnis diverifikasi.

Jangan commit `.env.local`. Hanya `.env.example` yang boleh masuk repository.

## Placeholder Visual

Karena foto asli belum tersedia, `public/images/` berisi ilustrasi SVG bernuansa brand sebagai placeholder. Ganti dengan aset asli (logo, foto produk, barista, interior) sebelum production launch.

## Deployment

Build statis menjalankan `next build` saja sudah cukup (seluruh rute prerender). Publikasikan dengan cara yang Anda gunakan (Vercel, Netlify, Node server, dsb.), pastikan variabel `NEXT_PUBLIC_*` di-set sesuai environment.
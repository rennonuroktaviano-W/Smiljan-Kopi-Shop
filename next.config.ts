import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy minimum untuk situs statis Next.js. Next.js
// menyisipkan skrip inline untuk hidrasi RSC dan style inline dari
// next/font, sehingga 'unsafe-inline' tetap diperlukan; 'unsafe-eval' hanya
// ditambahkan pada mode development agar HMR berjalan. Domain Cloudflare
// Web Analytics diizinkan eksplisit untuk beacon tanpa cookie (token kosong
// = beacon tidak dimuat sama sekali).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

// HSTS hanya ditambahkan pada produksi (HTTPS). `includeSubDomains`/`preload`
// sengaja belum diaktifkan sampai seluruh subdomain terverifikasi HTTPS —
// lihat SECURITY.md untuk cara mengaktifkannya.
if (isProd) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  });
}

const nextConfig: NextConfig = {
  // Jangan bocorkan versi framework melalui header X-Powered-By.
  poweredByHeader: false,
  reactStrictMode: true,
  // PGlite memuat WASM dan hanya dipakai untuk pengembangan/tes lokal;
  // biarkan sebagai paket eksternal agar tidak dipaketkan oleh bundler.
  serverExternalPackages: ["@electric-sql/pglite"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

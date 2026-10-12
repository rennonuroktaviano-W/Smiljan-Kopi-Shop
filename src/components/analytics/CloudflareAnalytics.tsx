import Script from "next/script";

const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim();

/**
 * Cloudflare Web Analytics: analytics agregat tanpa cookie, tanpa
 * identifikasi pengunjung. Hanya dimuat jika token beacon diisi di
 * environment, sehingga dev/test tetap bersih tanpa tracking.
 * Domain beacon diizinkan eksplisit di CSP `next.config.ts`.
 */
export default function CloudflareAnalytics() {
  if (!beaconToken) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: beaconToken })}
      strategy="afterInteractive"
    />
  );
}
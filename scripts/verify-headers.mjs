/**
 * Verifikasi header keamanan situs yang sudah dideploy, sekaligus memberi
 * indikasi apakah trafik benar-benar melewati Cloudflare.
 *
 * Pemakaian:
 *   node scripts/verify-headers.mjs https://domain-anda.com
 *   npm run verify:headers -- https://domain-anda.com
 *
 * Keluar dengan kode 1 jika ada pemeriksaan yang gagal.
 */

const target = process.argv[2];

if (!target) {
  console.error("Pemakaian: node scripts/verify-headers.mjs <url>");
  process.exit(2);
}

let url;
try {
  url = new URL(target);
} catch {
  console.error(`URL tidak valid: ${target}`);
  process.exit(2);
}

if (url.protocol !== "https:" && url.protocol !== "http:") {
  console.error("Hanya URL http/https yang didukung.");
  process.exit(2);
}

const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
const results = [];
const add = (name, ok, detail = "") => results.push({ name, ok, detail });

const headerValue = (headers, name) => headers.get(name) ?? "";

try {
  const response = await fetch(url, { redirect: "follow" });
  const headers = response.headers;
  const csp = headerValue(headers, "content-security-policy");

  add("Respons 200", response.status === 200, `status ${response.status}`);
  add("Content-Security-Policy terkirim", csp.length > 0);
  add("CSP frame-ancestors 'none'", csp.includes("frame-ancestors 'none'"));
  add("CSP object-src 'none'", csp.includes("object-src 'none'"));
  add("CSP base-uri 'self'", csp.includes("base-uri 'self'"));
  add(
    "X-Content-Type-Options: nosniff",
    headerValue(headers, "x-content-type-options") === "nosniff"
  );
  add("X-Frame-Options: DENY", headerValue(headers, "x-frame-options") === "DENY");
  add("Referrer-Policy terkirim", headerValue(headers, "referrer-policy").length > 0);
  add("Permissions-Policy terkirim", headerValue(headers, "permissions-policy").length > 0);
  add(
    "Cross-Origin-Opener-Policy: same-origin",
    headerValue(headers, "cross-origin-opener-policy") === "same-origin"
  );
  add("X-Powered-By tidak bocor", headers.get("x-powered-by") === null);
  add(
    "Strict-Transport-Security aktif",
    headerValue(headers, "strict-transport-security").includes("max-age=")
  );

  if (url.protocol === "https:" && !isLocal) {
    const httpUrl = new URL(url);
    httpUrl.protocol = "http:";
    try {
      const httpResponse = await fetch(httpUrl, { redirect: "manual" });
      const location = httpResponse.headers.get("location") ?? "";
      add(
        "HTTP dialihkan ke HTTPS",
        [301, 302, 307, 308].includes(httpResponse.status) && location.startsWith("https://"),
        `status ${httpResponse.status}${location ? ` → ${location}` : ""}`
      );
    } catch {
      add("HTTP dialihkan ke HTTPS", false, "permintaan http gagal");
    }
  }

  const cfRay = headers.get("cf-ray");
  const server = headerValue(headers, "server");
  if (cfRay) {
    console.log(`i  Trafik melewati Cloudflare (cf-ray: ${cfRay}).`);
  } else {
    console.log(
      `!  Cloudflare TIDAK terdeteksi (server: "${server || "tidak ada"}").`
    );
    console.log(
      "   Origin mungkin masih bisa diakses langsung. Lihat docs/cloudflare-setup.md bagian kunci origin."
    );
  }
} catch (error) {
  console.error(`Gagal mengambil ${url}: ${error.message}`);
  process.exit(2);
}

let failed = 0;
for (const result of results) {
  console.log(
    `${result.ok ? "OK " : "X  "} ${result.name}${result.detail ? ` (${result.detail})` : ""}`
  );
  if (!result.ok) failed += 1;
}

console.log("");
if (failed === 0) {
  console.log(`Semua ${results.length} pemeriksaan lulus.`);
} else {
  console.log(`${failed} dari ${results.length} pemeriksaan GAGAL.`);
  process.exit(1);
}
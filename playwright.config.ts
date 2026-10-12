import { defineConfig, devices } from "@playwright/test";

const port = 3100;

// Kredensial owner khusus pengujian lokal. Hanya dipakai untuk basis data
// PGlite sementara di ./.data — bukan rahasia produksi.
const TEST_OWNER_EMAIL = "owner@smiljan.test";
const TEST_OWNER_PASSWORD = "Smiljan!2345";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: /whatsapp-active\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run db:prepare && npm run build && npm run start -- --port ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      ...process.env,
      // Konfigurasi default: nomor WhatsApp kosong → CTA pemesanan nonaktif.
      NEXT_PUBLIC_WHATSAPP_NUMBER: "",
      NEXT_PUBLIC_BUSINESS_INFO_READY: "false",
      // Basis data lokal (PGlite) untuk pengujian; DATABASE_URL dikosongkan
      // agar tidak menyentuh Neon apa pun.
      DATABASE_URL: "",
      PGLITE_DIR: "./.data/pglite",
      ALLOW_LOCAL_DB: "1",
      AUTH_SECRET: "test-only-auth-secret-do-not-use-in-production",
      OWNER_EMAIL: TEST_OWNER_EMAIL,
      OWNER_PASSWORD: TEST_OWNER_PASSWORD,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

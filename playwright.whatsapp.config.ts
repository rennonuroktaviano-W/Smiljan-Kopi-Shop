import { defineConfig, devices } from "@playwright/test";

const port = 3200;

// Proyek khusus untuk menguji alur WhatsApp AKTIF dengan nomor uji.
// Build dijalankan dengan NEXT_PUBLIC_WHATSAPP_NUMBER agar CTA menghasilkan
// link wa.me yang benar — tanpa menyentuh .env.local milik pemilik.
export default defineConfig({
  testDir: "./e2e",
  testMatch: /whatsapp-active\.spec\.ts/,
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
    command: `npm run build && npm run start -- --port ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      ...process.env,
      NEXT_PUBLIC_WHATSAPP_NUMBER: "6281234567890",
      NEXT_PUBLIC_BUSINESS_INFO_READY: "false",
      AUTH_SECRET: "test-only-auth-secret-do-not-use-in-production",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
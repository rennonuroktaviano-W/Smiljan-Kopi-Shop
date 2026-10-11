import { test, expect } from "@playwright/test";

/** Kartu produk nonaktif dan visit page menampilkan fallback yang jelas tanpa link wa.me (§9). */
test.describe("whatsapp NONAKTIF (nomor kosong) (§9)", () => {
  test("/menu: CTA order disabled, tidak ada tautan wa.me", async ({ page }) => {
    await page.goto("/menu", { waitUntil: "networkidle" });

    await expect(
      page.getByText("Pemesanan belum aktif", { exact: true }).first()
    ).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
    await expect(page.locator('span[aria-disabled="true"]').first()).toBeVisible();
  });

  test("/visit: WhatsApp belum aktif, tanpa tautan wa.me", async ({ page }) => {
    await page.goto("/visit", { waitUntil: "networkidle" });

    await expect(page.getByText("WhatsApp belum aktif")).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  });

  test("halaman lain tidak memuat tautan wa.me", async ({ page }) => {
    for (const route of ["/", "/our-story"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
    }
  });
});
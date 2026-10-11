import { test, expect } from "@playwright/test";

/** Alur WhatsApp AKTIF dijalankan pada build terpisah dengan nomor uji. */
test.describe("whatsapp AKTIF (nomor uji) (§9)", () => {
  test("/menu: CTA order membuka wa.me dengan teks terenkode yang benar", async ({
    page,
  }) => {
    await page.goto("/menu", { waitUntil: "networkidle" });

    const orderLink = page
      .locator('a[href*="wa.me/6281234567890"]')
      .first();
    await expect(orderLink).toBeVisible();

    const href = await orderLink.getAttribute("href");
    expect(href).toBeTruthy();

    const url = new URL(href as string);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/6281234567890");

    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain("Halo Smiljan, saya ingin memesan:");
    expect(text).toContain("Espresso");
    expect(text).toContain("Mohon info ketersediaannya.");

    // Format pesan harus persis mengikuti contoh pesan di spesifikasi.
    expect(text).toEqual(
      "Halo Smiljan, saya ingin memesan:\n1. Espresso\nMohon info ketersediaannya."
    );
  });

  test("/visit: tombol Chat WhatsApp tersedia", async ({ page }) => {
    await page.goto("/visit", { waitUntil: "networkidle" });

    const whatsappLink = page.locator('a[href*="wa.me/6281234567890"]').first();
    await expect(whatsappLink).toBeVisible();
  });
});
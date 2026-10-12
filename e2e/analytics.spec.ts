import { test, expect } from "@playwright/test";

/**
 * Jaminan privasi default (§10): selama NEXT_PUBLIC_CF_BEACON_TOKEN kosong,
 * tidak ada beacon analytics yang dimuat dan situs tidak memasang cookie.
 */
test.describe("privasi default", () => {
  test("beacon Cloudflare tidak dimuat saat token kosong", async ({ page }) => {
    const analyticsRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("cloudflareinsights")) {
        analyticsRequests.push(request.url());
      }
    });

    for (const route of ["/", "/menu", "/visit", "/privacy"]) {
      await page.goto(route, { waitUntil: "networkidle" });
    }

    expect(analyticsRequests).toEqual([]);
  });

  test("situs tidak memasang cookie apa pun", async ({ context, page }) => {
    for (const route of ["/", "/menu", "/our-story", "/visit", "/privacy"]) {
      await page.goto(route, { waitUntil: "networkidle" });
    }

    const cookies = await context.cookies();
    expect(cookies).toEqual([]);
  });

  test("/privacy dapat diakses dari footer", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const privacyLink = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Kebijakan Privasi" });
    await expect(privacyLink).toBeVisible();

    await privacyLink.click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Kebijakan Privasi/i })
    ).toBeVisible();
  });
});
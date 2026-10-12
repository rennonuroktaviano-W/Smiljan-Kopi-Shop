import { test, expect } from "@playwright/test";

const routes = ["/", "/menu", "/our-story", "/visit", "/privacy"];

test.describe("SEO & social preview", () => {
  for (const route of routes) {
    test(`${route}: memiliki og:image dan twitter card`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });

      const ogImage = await page
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute("content");
      expect(ogImage, "og:image").toBeTruthy();

      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .first()
        .getAttribute("content");
      expect(twitterCard).toBe("summary_large_image");
    });
  }

  test("og:image dapat dimuat sebagai PNG", async ({ page, request }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    expect(ogImage).toBeTruthy();

    const response = await request.get(new URL(ogImage!, page.url()).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("sitemap memuat seluruh rute publik", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const xml = await response.text();
    for (const route of ["/menu", "/our-story", "/visit", "/privacy"]) {
      expect(xml).toContain(route);
    }
  });
});

import { test, expect, type Page } from "@playwright/test";

// §13 PRD: target viewport yang wajib diuji.
const viewportTargets = [
  { name: "320x568 ponsel kecil", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024 tablet portrait", width: 768, height: 1024 },
  { name: "1024x768 tablet landscape", width: 1024, height: 768 },
  { name: "1280x800 laptop", width: 1280, height: 800 },
  { name: "1440x900 desktop", width: 1440, height: 900 },
  { name: "1920x1080 desktop lebar", width: 1920, height: 1080 },
];

const routes = ["/", "/menu", "/our-story", "/visit"];

/** Selisih horizontal overflow pada document root. */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    return (
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
    );
  });
}

test.describe("responsive matrix (§13)", () => {
  for (const vp of viewportTargets) {
    test(`tidak ada horizontal overflow di ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of routes) {
        await page.goto(route, { waitUntil: "networkidle" });
        const overflow = await horizontalOverflow(page);
        expect(
          overflow,
          `${route} overflow di ${vp.width}x${vp.height}`
        ).toBeLessThanOrEqual(0);
      }
    });
  }

  test("hero: headline & kedua CTA selalu terlihat di ponsel kecil", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", { level: 1, name: /More Than Just Coffee/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Menu" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Our Story" }).first()
    ).toBeVisible();
  });

  test("zoom 200%: tidak ada overflow horizontal (§13)", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route, { waitUntil: "networkidle" });
      const session = await page.context().newCDPSession(page);
      await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
      const overflow = await horizontalOverflow(page);
      expect(overflow, `${route} overflow saat zoom 200%`).toBeLessThanOrEqual(
        0
      );
      await session.detach();
    }
  });

  test("header desktop: nav & CTA Order Coffee terlihat", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/menu", { waitUntil: "networkidle" });

    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Menu" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Our Story" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Visit" })).toBeVisible();
    await expect(
      header.getByRole("link", { name: "Order Coffee" })
    ).toBeVisible();
  });
});
import { test, expect } from "@playwright/test";

const routes = ["/", "/menu", "/our-story", "/visit", "/privacy"];

test.describe("accessibility basics (§14)", () => {
  for (const route of routes) {
    test(`${route}: skip-link, satu h1, semua img punya alt`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "networkidle" });

      const skip = page.locator('a.skip-link[href="#main"]');
      await expect(skip).toHaveCount(1);

      const h1 = page.locator("h1");
      await expect(h1).toHaveCount(1);

      const images = page.locator("img");
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt, `img ke-${i} tanpa atribut alt`).not.toBeNull();
      }
    });
  }

  test("skip-link dapat difokus & mengarah ke #main", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const skip = page.locator('a.skip-link[href="#main"]');
    await expect(skip).toBeFocused();
  });

  test("filter menu dapat dioperasikan keyboard dengan indikator aktif (§9/§14)", async ({
    page,
  }) => {
    await page.goto("/menu", { waitUntil: "networkidle" });

    const allButton = page.getByRole("button", { name: "All", exact: true });
    const coffeeButton = page.getByRole("button", {
      name: "Coffee",
      exact: true,
    });

    await expect(allButton).toHaveAttribute("aria-pressed", "true");
    await expect(coffeeButton).toHaveAttribute("aria-pressed", "false");

    await coffeeButton.focus();
    await expect(coffeeButton).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(coffeeButton).toHaveAttribute("aria-pressed", "true");
    await expect(allButton).toHaveAttribute("aria-pressed", "false");

    const cards = page.locator("article");
    await expect(cards).toHaveCount(5);
  });

  test("drawer mobile: buka/Tutup, Escape, dan focus management (§8.1/§14)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });

    const toggle = page.locator('header button[aria-expanded]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-label", "Buka menu navigasi");
    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("aria-label", "Tutup menu navigasi");
    const nav = page.getByRole("navigation", { name: "Menu utama" });
    await expect(nav).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveAttribute("aria-label", "Buka menu navigasi");
  });

  test("reduced-motion: konten hero langsung terlihat (§12)", async ({
    page,
  }) => {
    const reducedPage = await page.context().newPage();
    await reducedPage.emulateMedia({ reducedMotion: "reduce" });
    await reducedPage.goto("/", { waitUntil: "networkidle" });

    const heading = reducedPage.getByRole("heading", {
      level: 1,
      name: /Kopi Pelan, Hari Tenang/i,
    });
    await expect(heading).toBeVisible();
    const opacity = await heading.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.99);
    await reducedPage.close();
  });
});
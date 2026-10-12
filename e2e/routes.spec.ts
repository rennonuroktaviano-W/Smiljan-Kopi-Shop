import { test, expect, type Page } from "@playwright/test";

const htmlRoutes = ["/", "/menu", "/our-story", "/visit", "/privacy"];
const staticFiles = ["/sitemap.xml", "/robots.txt"];

async function hookErrors(
  page: Page
): Promise<{
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: { url: string; status: number }[];
}> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: { url: string; status: number }[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));
  page.on("response", (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  return { consoleErrors, pageErrors, failedRequests };
}

function assertCleanPage(hooked: {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: { url: string; status: number }[];
}) {
  expect(hooked.consoleErrors, "console errors").toEqual([]);
  expect(hooked.pageErrors, "uncaught page errors").toEqual([]);
  expect(hooked.failedRequests, "failed/4xx+ requests").toEqual([]);
}

test.describe("smoke routes", () => {
  for (const route of htmlRoutes) {
    test(`GET ${route} → 200, tanpa errors, satu h1, favicon ok`, async ({
      page,
    }) => {
      const hooked = await hookErrors(page);
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);

      await assertCleanPage(hooked);

      const headings = page.locator("h1");
      await expect(headings).toHaveCount(1);

      const favicon = await page
        .locator('link[rel="icon"]')
        .first()
        .getAttribute("href");
      expect(favicon).toBeTruthy();
    });
  }

  for (const route of staticFiles) {
    test(`GET ${route} → 200 tanpa error`, async ({ page }) => {
      const hooked = await hookErrors(page);
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await assertCleanPage(hooked);
    });
  }
});
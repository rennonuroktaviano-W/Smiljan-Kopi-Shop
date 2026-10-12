import { test, expect, type Page } from "@playwright/test";

const OWNER_EMAIL = "owner@smiljan.test";
const OWNER_PASSWORD = "Smiljan!2345";

async function login(page: Page, email = OWNER_EMAIL, password = OWNER_PASSWORD) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata sandi").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
}

test.describe("admin: proteksi rute", () => {
  test("anonim diarahkan dari /admin ke halaman masuk", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Masuk" })
    ).toBeVisible();
  });

  test("anonim tidak dapat membuka sub-rute admin", async ({ page }) => {
    await page.goto("/admin/menu");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("halaman login tidak diindeks mesin pencari", async ({ request }) => {
    const response = await request.get("/admin/login");
    const html = await response.text();
    expect(html).toContain("noindex");
  });

  test("robots.txt melarang area admin", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();
    expect(body).toContain("/admin");
  });
});

test.describe("admin: autentikasi", () => {
  test("kata sandi salah menampilkan pesan galat dan tidak masuk", async ({
    page,
  }) => {
    await login(page, OWNER_EMAIL, "kata-sandi-salah-123");
    await expect(
      page.getByText("Email atau kata sandi tidak valid.")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("kredensial valid masuk ke ringkasan dan menampilkan peran", async ({
    page,
  }) => {
    await login(page);
    await page.waitForURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Selamat datang/ })
    ).toBeVisible();
    await expect(page.getByText("Pemilik").first()).toBeVisible();
  });

  test("mencatat aktivitas login pada log audit", async ({ page }) => {
    await login(page);
    await page.waitForURL(/\/admin$/);
    await expect(page.getByText("auth.login").first()).toBeVisible();
  });

  test("keluar mencabut sesi dan melindungi /admin kembali", async ({ page }) => {
    await login(page);
    await page.waitForURL(/\/admin$/);

    await page.getByRole("button", { name: "Keluar" }).click();
    await page.waitForURL(/\/admin\/login$/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

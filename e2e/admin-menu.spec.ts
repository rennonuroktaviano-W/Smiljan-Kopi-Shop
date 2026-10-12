import { test, expect, type Page } from "@playwright/test";

const OWNER_EMAIL = "owner@smiljan.test";
const OWNER_PASSWORD = "Smiljan!2345";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(OWNER_EMAIL);
  await page.getByLabel("Kata sandi").fill(OWNER_PASSWORD);
  await page.getByRole("button", { name: "Masuk" }).click();
  await page.waitForURL(/\/admin$/);
}

function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

test.describe("admin: manajemen menu", () => {
  test("menampilkan item dari basis data", async ({ page }) => {
    await login(page);
    await page.goto("/admin/menu");
    await expect(
      page.getByRole("heading", { level: 1, name: "Manajemen Menu" })
    ).toBeVisible();
    await expect(page.getByText("Kopi Kenangan Mantan")).toBeVisible();
  });

  test("validasi menolak item tanpa nama", async ({ page }) => {
    await login(page);
    await page.goto("/admin/menu/new");
    await page.getByRole("button", { name: "Simpan item" }).click();
    await expect(page.getByText("Nama wajib diisi.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/menu\/new$/);
  });

  test("membuat, mengubah, dan menghapus item", async ({ page }) => {
    const suffix = uniqueSuffix();
    const itemId = `uji-cms-${suffix}`;
    const itemName = `Item Uji CMS ${suffix}`;

    await login(page);
    await page.goto("/admin/menu/new");

    await page.getByLabel("ID (slug)").fill(itemId);
    await page.getByLabel("Nama").fill(itemName);
    await page.getByLabel("Harga (Rupiah, kosongkan bila belum ada)").fill("21000");
    await page.getByLabel("Path/URL gambar").fill("/images/menu/latte.jpg");
    await page.getByLabel("Teks alternatif").fill("Item uji");
    // Biarkan tidak dipublikasikan agar tidak mengubah halaman /menu publik.
    await page.getByLabel("Publikasikan").uncheck();
    await page.getByRole("button", { name: "Simpan item" }).click();

    await page.waitForURL(/\/admin\/menu$/);
    const row = page.getByRole("row", { name: new RegExp(itemName) });
    await expect(row).toBeVisible();
    await expect(row.getByText("Draf")).toBeVisible();

    await row.getByRole("link", { name: "Ubah" }).click();
    await page.waitForURL(/\/admin\/menu\/uji-cms-/);
    await page
      .getByLabel("Harga (Rupiah, kosongkan bila belum ada)")
      .fill("23000");
    await page.getByRole("button", { name: "Perbarui item" }).click();
    await page.waitForURL(/\/admin\/menu$/);
    await expect(
      page.getByRole("row", { name: new RegExp(itemName) })
    ).toContainText("23.000");

    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("row", { name: new RegExp(itemName) })
      .getByRole("button", { name: "Hapus" })
      .click();
    await page.waitForURL(/\/admin\/menu$/);
    await expect(
      page.getByRole("row", { name: new RegExp(itemName) })
    ).toHaveCount(0);
  });

  test("item yang tidak dipublikasikan tidak tampil di /menu publik", async ({
    page,
  }) => {
    const suffix = uniqueSuffix();
    const itemId = `uji-draf-${suffix}`;
    const itemName = `Item Draf ${suffix}`;

    await login(page);
    await page.goto("/admin/menu/new");
    await page.getByLabel("ID (slug)").fill(itemId);
    await page.getByLabel("Nama").fill(itemName);
    await page.getByLabel("Path/URL gambar").fill("/images/menu/latte.jpg");
    await page.getByLabel("Teks alternatif").fill("Item draf");
    await page.getByLabel("Publikasikan").uncheck();
    await page.getByRole("button", { name: "Simpan item" }).click();
    await page.waitForURL(/\/admin\/menu$/);

    await page.goto("/menu");
    await expect(page.getByText(itemName)).toHaveCount(0);

    await page.goto("/admin/menu");
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("row", { name: new RegExp(itemName) })
      .getByRole("button", { name: "Hapus" })
      .click();
    await page.waitForURL(/\/admin\/menu$/);
  });
});

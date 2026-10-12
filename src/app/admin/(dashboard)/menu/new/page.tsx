import Link from "next/link";
import { getDb } from "@/lib/db";
import { listMenuCategories } from "@/lib/db/repositories/menu";
import { requirePermission } from "@/lib/auth/guard";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { createMenuItemAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewMenuItemPage() {
  await requirePermission("menu.manage");
  const db = await getDb();
  const categories = await listMenuCategories(db);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/menu"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite hover:underline"
        >
          ← Kembali ke daftar
        </Link>
        <h1 className="mt-3 font-display text-3xl text-obsidian">
          Tambah Item Menu
        </h1>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone bg-ivory px-5 py-6 text-sm text-graphite">
          Belum ada kategori. Jalankan <code>npm run db:seed:menu</code> untuk
          menyiapkan kategori bawaan.
        </p>
      ) : (
        <MenuItemForm
          action={createMenuItemAction}
          categories={categories}
          mode="create"
          submitLabel="Simpan item"
        />
      )}
    </div>
  );
}

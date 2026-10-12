import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  getMenuItemById,
  listMenuCategories,
} from "@/lib/db/repositories/menu";
import { requirePermission } from "@/lib/auth/guard";
import MenuItemForm, {
  type MenuItemFormValues,
} from "@/components/admin/MenuItemForm";
import { updateMenuItemAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("menu.manage");
  const { id } = await params;

  const db = await getDb();
  const [row, categories] = await Promise.all([
    getMenuItemById(db, id),
    listMenuCategories(db),
  ]);

  if (!row) notFound();

  const values: MenuItemFormValues = {
    id: row.id,
    name: row.name,
    description: row.description,
    categoryId: row.categoryId,
    price: row.price === null ? "" : String(row.price),
    image: row.image,
    imageAlt: row.imageAlt,
    featured: row.featured,
    availabilityStatus: row.availabilityStatus,
    imageSource: row.imageSource,
    imageLicense: row.imageLicense,
    sourceUrl: row.sourceUrl,
    isPublished: row.isPublished,
  };

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
          Ubah Item Menu
        </h1>
      </div>

      <MenuItemForm
        action={updateMenuItemAction}
        categories={categories}
        values={values}
        mode="edit"
        submitLabel="Perbarui item"
      />
    </div>
  );
}

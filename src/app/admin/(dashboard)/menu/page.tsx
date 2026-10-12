import Link from "next/link";
import { getDb } from "@/lib/db";
import {
  listMenuCategories,
  listMenuItemRows,
} from "@/lib/db/repositories/menu";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/auth/roles";
import { formatCurrency } from "@/lib/format-currency";
import { DeleteMenuItemButton } from "./row-actions";
import { toggleMenuItemPublishAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  available: "Tersedia",
  unavailable: "Tidak tersedia",
  "coming-soon": "Segera hadir",
};

export default async function AdminMenuPage() {
  const user = await requirePermission("menu.view");
  const db = await getDb();
  const [rows, categories] = await Promise.all([
    listMenuItemRows(db),
    listMenuCategories(db),
  ]);
  const categoryLabels = new Map(
    categories.map((category) => [category.id, category.label])
  );
  const canManage = can(user.role, "menu.manage");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive-deep">
            Konten
          </p>
          <h1 className="mt-2 font-display text-3xl text-obsidian">
            Manajemen Menu
          </h1>
          <p className="mt-2 text-body text-graphite">
            {rows.length} item pada katalog. Perubahan tampil di halaman publik
            menu setelah direvalidasi.
          </p>
        </div>
        {canManage ? (
          <Link
            href="/admin/menu/new"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-obsidian px-6 text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-graphite"
          >
            Tambah item
          </Link>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone bg-ivory px-5 py-8 text-sm text-graphite">
          Belum ada item menu. Jalankan <code>npm run db:seed:menu</code> atau
          tambahkan item baru.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone bg-ivory">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-stone text-label uppercase tracking-[0.15em] text-graphite">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Nama
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Kategori
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Harga
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Publikasi
                </th>
                {canManage ? (
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Aksi
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 text-obsidian">
                    <span className="font-medium">{row.name}</span>
                    <span className="mt-0.5 block text-xs text-graphite">
                      {row.id}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-graphite">
                    {categoryLabels.get(row.categoryId) ?? row.categoryId}
                  </td>
                  <td className="px-5 py-3 text-graphite">
                    {row.price === null
                      ? "Harga menyusul"
                      : formatCurrency(row.price)}
                  </td>
                  <td className="px-5 py-3 text-graphite">
                    {STATUS_LABEL[row.availabilityStatus] ??
                      row.availabilityStatus}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        row.isPublished ? "text-olive-deep" : "text-graphite"
                      }
                    >
                      {row.isPublished ? "Terbit" : "Draf"}
                    </span>
                  </td>
                  {canManage ? (
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/menu/${row.id}`}
                          className="text-xs font-semibold uppercase tracking-[0.12em] text-obsidian hover:underline"
                        >
                          Ubah
                        </Link>
                        <form action={toggleMenuItemPublishAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <input
                            type="hidden"
                            name="publish"
                            value={String(!row.isPublished)}
                          />
                          <button
                            type="submit"
                            className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite hover:underline"
                          >
                            {row.isPublished ? "Sembunyikan" : "Terbitkan"}
                          </button>
                        </form>
                        <DeleteMenuItemButton id={row.id} name={row.name} />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

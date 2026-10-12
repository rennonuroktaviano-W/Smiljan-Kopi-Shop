import { count, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";
import { countMenuItems } from "@/lib/db/repositories/menu";
import { getCurrentUser } from "@/lib/auth/guard";
import { ROLE_LABELS } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-stone bg-ivory p-5">
      <p className="text-label font-semibold uppercase tracking-[0.2em] text-graphite">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-obsidian">{value}</p>
      <p className="mt-2 text-sm text-graphite">{hint}</p>
    </div>
  );
}

const OUTCOME_LABEL: Record<string, string> = {
  success: "Berhasil",
  failure: "Gagal",
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getCurrentUser();
  const db = await getDb();

  const [userCountRows, auditCountRows, menuCount, recentAudit] =
    await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(auditLogs),
      countMenuItems(db),
      db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8),
    ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive-deep">
          Ringkasan
        </p>
        <h1 className="mt-2 font-display text-3xl text-obsidian">
          Selamat datang{user?.name ? `, ${user.name}` : ""}.
        </h1>
        <p className="mt-2 text-body text-graphite">
          Peran Anda: {user ? ROLE_LABELS[user.role] : "-"}. Panel ini sedang
          dibangun bertahap; data yang tampil di bawah adalah data nyata dari
          sistem.
        </p>
      </div>

      {error === "forbidden" ? (
        <p
          role="alert"
          className="rounded-md border border-olive-deep/40 bg-olive/10 px-4 py-3 text-sm text-obsidian"
        >
          Anda tidak memiliki izin untuk membuka halaman tersebut.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Item menu"
          value={menuCount}
          hint="Item pada katalog basis data (termasuk yang belum dipublikasikan)."
        />
        <StatCard
          label="Akun admin"
          value={userCountRows[0]?.value ?? 0}
          hint="Jumlah akun yang dapat mengakses panel."
        />
        <StatCard
          label="Peristiwa tercatat"
          value={auditCountRows[0]?.value ?? 0}
          hint="Total entri pada log aktivitas."
        />
      </div>

      <section aria-labelledby="recent-activity">
        <h2
          id="recent-activity"
          className="font-display text-xl text-obsidian"
        >
          Aktivitas terbaru
        </h2>
        {recentAudit.length === 0 ? (
          <p className="mt-4 rounded-lg border border-stone bg-ivory px-5 py-6 text-sm text-graphite">
            Belum ada aktivitas tercatat.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-stone bg-ivory">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-stone text-label uppercase tracking-[0.15em] text-graphite">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Waktu
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Aktor
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Aksi
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Hasil
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone">
                {recentAudit.map((entry) => (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-graphite">
                      {entry.createdAt.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 text-obsidian">
                      {entry.actorEmail ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-obsidian">{entry.action}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          entry.outcome === "success"
                            ? "text-olive-deep"
                            : "text-graphite"
                        }
                      >
                        {OUTCOME_LABEL[entry.outcome] ?? entry.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        aria-labelledby="upcoming"
        className="rounded-lg border border-stone bg-ivory p-5"
      >
        <h2 id="upcoming" className="font-display text-xl text-obsidian">
          Modul dalam pengembangan
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-graphite">
          <li>Manajemen menu & kategori</li>
          <li>Pustaka media dan unggahan gambar</li>
          <li>Halaman, desain, navigasi, promosi, dan SEO</li>
          <li>Pengaturan bisnis, publikasi, dan log audit lanjutan</li>
        </ul>
      </section>
    </div>
  );
}

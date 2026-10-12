import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, type UserRow } from "@/lib/db/schema";
import { auth } from "./index";
import { can, type Permission } from "./roles";

/**
 * Mengambil pengguna terautentikasi dari sesi + basis data. Memvalidasi ulang
 * di server: akun aktif dan versi sesi cocok (pencabutan sesi instan).
 * Di-cache per request agar tidak berulang.
 */
export const getCurrentUser = cache(async (): Promise<UserRow | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const db = await getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user || !user.isActive) return null;
  if (user.sessionVersion !== session?.user?.sessionVersion) return null;

  return user;
});

export async function requireUser(): Promise<UserRow> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Menegakkan izin di server. Ini adalah batas keamanan sebenarnya —
 * penyembunyian tombol di UI bukan pengamanan.
 */
export async function requirePermission(permission: Permission): Promise<UserRow> {
  const user = await requireUser();
  if (!can(user.role, permission)) {
    redirect("/admin?error=forbidden");
  }
  return user;
}

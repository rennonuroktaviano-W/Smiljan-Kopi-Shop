import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { adminNav } from "@/components/admin/nav";
import { can } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/guard";
import { signOutAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const nav = adminNav
    .filter((item) => can(user.role, item.permission))
    .map(({ href, label }) => ({ href, label }));

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, role: user.role }}
      nav={nav}
      signOut={signOutAction}
    >
      {children}
    </AdminShell>
  );
}

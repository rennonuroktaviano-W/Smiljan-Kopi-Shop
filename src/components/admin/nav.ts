import type { Permission } from "@/lib/auth/roles";

export interface AdminNavItem {
  href: string;
  label: string;
  permission: Permission;
}

/**
 * Definisi navigasi admin. Setiap item dikaitkan dengan satu izin; item hanya
 * tampil bila peran pengguna memilikinya. Penyembunyian ini murni UX —
 * halaman tetap menegakkan izin di server.
 */
export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Ringkasan", permission: "dashboard.view" },
  { href: "/admin/menu", label: "Menu", permission: "menu.view" },
  { href: "/admin/categories", label: "Kategori", permission: "categories.view" },
  { href: "/admin/media", label: "Media", permission: "media.view" },
  { href: "/admin/pages", label: "Halaman", permission: "pages.view" },
  { href: "/admin/design", label: "Desain", permission: "design.manage" },
  {
    href: "/admin/navigation",
    label: "Navigasi",
    permission: "navigation.manage",
  },
  { href: "/admin/marketing", label: "Promosi", permission: "marketing.manage" },
  { href: "/admin/seo", label: "SEO", permission: "seo.manage" },
  { href: "/admin/settings", label: "Pengaturan", permission: "settings.manage" },
  { href: "/admin/users", label: "Pengguna", permission: "users.manage" },
  { href: "/admin/audit-logs", label: "Log Aktivitas", permission: "audit.view" },
];

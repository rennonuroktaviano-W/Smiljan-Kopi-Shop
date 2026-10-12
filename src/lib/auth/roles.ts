/**
 * Kebijakan otorisasi terpusat. Semua pemeriksaan izin di server HARUS lewat
 * sini. Prinsip: tolak secara default (default deny) — peran tanpa izin
 * eksplisit tidak boleh melakukan apa pun.
 */

export const ROLES = ["owner", "admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "dashboard.view",
  "menu.view",
  "menu.manage",
  "categories.view",
  "categories.manage",
  "media.view",
  "media.manage",
  "pages.view",
  "pages.manage",
  "pages.publish",
  "design.manage",
  "navigation.manage",
  "marketing.manage",
  "seo.manage",
  "settings.manage",
  "users.manage",
  "audit.view",
  "backup.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  owner: PERMISSIONS,
  admin: [
    "dashboard.view",
    "menu.view",
    "menu.manage",
    "categories.view",
    "categories.manage",
    "media.view",
    "media.manage",
    "pages.view",
    "pages.manage",
    "pages.publish",
    "design.manage",
    "navigation.manage",
    "marketing.manage",
    "seo.manage",
    "settings.manage",
    "audit.view",
  ],
  editor: [
    "dashboard.view",
    "menu.view",
    "menu.manage",
    "categories.view",
    "media.view",
    "media.manage",
    "pages.view",
    "pages.manage",
  ],
  viewer: [
    "dashboard.view",
    "menu.view",
    "categories.view",
    "media.view",
    "pages.view",
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Pemilik",
  admin: "Administrator",
  editor: "Editor",
  viewer: "Pengamat",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function permissionsFor(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

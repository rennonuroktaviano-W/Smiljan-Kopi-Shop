"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";

export interface AdminNavLink {
  href: string;
  label: string;
}

interface AdminShellProps {
  user: { name: string; email: string; role: Role };
  nav: AdminNavLink[];
  signOut: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  user,
  nav,
  signOut,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const displayName = user.name || user.email;

  const navList = (
    <nav aria-label="Navigasi admin">
      <ul className="space-y-1">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-ivory text-obsidian"
                    : "text-stone hover:bg-white/10 hover:text-ivory"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-svh bg-stone/30 lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden bg-obsidian px-4 py-6 lg:block">
        <div className="px-3 pb-6">
          <p className="font-display text-lg text-ivory">SMILJAN</p>
          <p className="text-label uppercase tracking-[0.3em] text-olive">
            Admin
          </p>
        </div>
        {navList}
      </aside>

      <div className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-stone bg-ivory px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="admin-mobile-nav"
              aria-label="Buka navigasi admin"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-obsidian hover:bg-stone/60 lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div>
              <p className="text-sm font-semibold text-obsidian">{displayName}</p>
              <p className="text-label uppercase tracking-[0.2em] text-graphite">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-obsidian px-4 text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
            >
              Keluar
            </button>
          </form>
        </header>

        <main id="admin-main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Drawer mobile */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi admin"
            className="absolute inset-0 bg-obsidian/50"
            onClick={() => setOpen(false)}
          />
          <div
            id="admin-mobile-nav"
            className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-obsidian px-4 py-6"
          >
            <div className="flex items-center justify-between px-3 pb-6">
              <p className="font-display text-lg text-ivory">SMILJAN Admin</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup navigasi admin"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-ivory hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            {navList}
          </div>
        </div>
      ) : null}
    </div>
  );
}

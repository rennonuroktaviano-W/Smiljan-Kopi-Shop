"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/data/site";
import Logo from "@/components/ui/Logo";
import Container from "@/components/layout/Container";

function NavItems({
  pathname,
  tone,
  className = "",
}: {
  pathname: string;
  tone: "light" | "dark";
  className?: string;
}) {
  const isLight = tone === "light";
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {navLinks.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
              isLight ? "text-fog hover:text-ivory" : "text-graphite hover:text-obsidian"
            } ${active ? (isLight ? "text-ivory" : "text-obsidian") : ""}`}
          >
            {link.label}
            {active ? (
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 -bottom-0.5 h-px ${
                  isLight ? "bg-ivory/70" : "bg-obsidian/60"
                }`}
              />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h10" />
      )}
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";
  // Transparan di atas hero hanya pada homepage; halaman lain solid sejak awal.
  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  // Kunci scroll body dan kelola focus saat drawer terbuka.
  useEffect(() => {
    if (open) {
      const previousOverflow = document.body.style.overflow;
      const closeButton = closeButtonRef.current;
      const openButton = openButtonRef.current;
      document.body.style.overflow = "hidden";
      closeButton?.focus();
      return () => {
        document.body.style.overflow = previousOverflow;
        openButton?.focus();
      };
    }
  }, [open]);

  // Tutup dengan tombol Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeMenu]);

  const headerTone: "light" | "dark" = solid ? "dark" : "light";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-stone/70 bg-ivory/95 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Logo tone={headerTone} />

        <div className="hidden md:flex md:items-center md:gap-2">
          <NavItems pathname={pathname} tone={headerTone} />
          <Link
            href="/menu"
            className={`ml-3 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
              solid
                ? "bg-obsidian text-ivory hover:bg-graphite"
                : "bg-ivory text-obsidian hover:bg-stone"
            }`}
          >
            {siteConfig.orderCtaLabel}
          </Link>
        </div>

        <button
          ref={openButtonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors md:hidden ${
            solid
              ? "text-obsidian hover:bg-stone/60"
              : "text-ivory hover:bg-white/10"
          }`}
        >
          <MenuIcon open={open} />
        </button>
      </Container>

      {/* Drawer mobile */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-ivory px-5 pb-10 pt-6 md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeMenu}
          className="sr-only"
          aria-label="Tutup menu navigasi"
          tabIndex={open ? 0 : -1}
        >
          Tutup
        </button>
        <nav aria-label="Menu utama">
          <ul className="flex flex-col divide-y divide-stone">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 items-center font-display text-2xl transition-colors ${
                      active ? "text-obsidian" : "text-graphite hover:text-obsidian"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto pt-8">
          <Link
            href="/menu"
            onClick={closeMenu}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-obsidian px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-graphite"
          >
            {siteConfig.orderCtaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
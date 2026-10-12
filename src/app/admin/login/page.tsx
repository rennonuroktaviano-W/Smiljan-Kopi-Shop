import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-obsidian px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-2xl text-ivory focus-visible:outline-ivory"
          >
            SMILJAN
          </Link>
          <p className="mt-2 text-label uppercase tracking-[0.3em] text-olive">
            Panel Admin
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h1 className="mb-6 font-display text-xl text-ivory">Masuk</h1>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-fog">
          Hanya untuk pengelola terverifikasi. Aktivitas login dicatat.
        </p>
      </div>
    </div>
  );
}

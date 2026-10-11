"use client";

import Container from "@/components/layout/Container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-svh items-center bg-ivory pb-16 pt-32">
      <Container>
        <div className="max-w-xl">
          <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
            Error
          </p>
          <h1 className="mt-4 font-display text-section text-obsidian">
            Terjadi Kendala.
          </h1>
          <p className="mt-5 text-body text-graphite">
            Maaf, ada yang tidak berjalan sesuai rencana. Silakan coba lagi —
            jika terus terjadi, hubungi pemilik.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-9 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition-colors duration-200 hover:bg-graphite"
          >
            Coba Lagi
          </button>
        </div>
      </Container>
    </section>
  );
}
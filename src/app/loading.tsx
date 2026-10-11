import Container from "@/components/layout/Container";

export default function Loading() {
  return (
    <section className="flex min-h-svh items-center bg-ivory">
      <Container>
        <div
          role="status"
          aria-live="polite"
          className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center"
        >
          <span
            aria-hidden="true"
            className="size-10 animate-pulse rounded-full bg-olive/60"
          />
          <p className="text-label font-medium uppercase tracking-[0.3em] text-graphite">
            Memuat...
          </p>
          <span className="sr-only">Halaman sedang dimuat</span>
        </div>
      </Container>
    </section>
  );
}
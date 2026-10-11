import Container from "@/components/layout/Container";
import CtaLink from "@/components/ui/CtaLink";

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center bg-ivory pb-16 pt-32">
      <Container>
        <div className="max-w-xl">
          <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
            404
          </p>
          <h1 className="mt-4 font-display text-section text-obsidian">
            Halaman Tidak Ditemukan.
          </h1>
          <p className="mt-5 text-body text-graphite">
            Halaman yang Anda cari sepertinya sudah dipindahkan atau tidak ada.
            Mari kembali ke menu atau beranda.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <CtaLink href="/" variant="primary" showArrow>
              Beranda
            </CtaLink>
            <CtaLink href="/menu" variant="secondary">
              Menu
            </CtaLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
import type { Metadata } from "next";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Container from "@/components/layout/Container";
import DevNotice from "@/components/ui/DevNotice";
import CtaLink from "@/components/ui/CtaLink";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita di balik SMILJAN: kopi yang diracik pelan, dari biji pilihan sampai cangkir Anda.",
};

function ValueCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-stone pt-5">
      <h3 className="font-display text-xl text-obsidian">{title}</h3>
      <p className="mt-2 text-body text-graphite">{children}</p>
    </div>
  );
}

export default function OurStoryPage() {
  return (
    <>
      <section className="bg-ivory pb-20 pt-28 md:pt-36">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive-deep">
                Tentang Kami
              </p>
              <h1 className="mt-4 font-display text-section text-obsidian">
                Cerita Kami
              </h1>
            </div>
          </Reveal>

          <div className="mt-6">
            <DevNotice>
              Cerita di halaman ini masih kami tulis sedikit demi sedikit.
              Nantikan versi lengkapnya.
            </DevNotice>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="space-y-6 text-body text-graphite">
                <p>
                  SMILJAN hadir dari satu keyakinan sederhana: kopi yang
                  disajikan dengan sungguh-sungguh bisa membuat hari terasa
                  lebih baik. Kami tidak terburu-buru, dan kami tidak mengejar
                  keramaian.
                </p>
                <p>
                  Setiap cangkir kami mulai dari pemilihan biji, penyeduhan
                  yang hati-hati, hingga momen Anda duduk dan menikmatinya.
                  Ruang ini kami rancang agar terasa tenang — tempat untuk
                  berhenti, bercakap, atau sekadar bernapas sejenak.
                </p>
                <p>
                  Cerita kami masih ditulis setiap hari, satu cangkir pada satu
                  waktu.{" "}
                  <span className="italic text-obsidian">
                    Kopi Baik. Hari Baik.
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-obsidian">
                <ImageWithFallback
                  src="/images/story/barista.jpg"
                  alt="Barista menyiapkan seduhan kopi"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-section text-obsidian">
              Nilai yang Kami Pegang.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <Reveal delay={60}>
              <ValueCard title="Pelan dan Teliti">
                Mengambil waktu untuk menyeduh yang benar, bukan yang cepat.
              </ValueCard>
            </Reveal>
            <Reveal delay={140}>
              <ValueCard title="Hormat pada Bahan">
                Memilih bahan dengan hati-hati dan menyajikannya tanpa berlebihan.
              </ValueCard>
            </Reveal>
            <Reveal delay={220}>
              <ValueCard title="Ruang yang Tenang">
                Menciptakan suasana yang nyaman untuk berkumpul dan beristirahat.
              </ValueCard>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-16 flex flex-wrap gap-4">
              <CtaLink href="/menu" variant="primary" showArrow>
                Lihat Menu
              </CtaLink>
              <CtaLink href="/visit" variant="secondary">
                Kunjungi Kami
              </CtaLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
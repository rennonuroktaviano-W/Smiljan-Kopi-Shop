import Image from "next/image";
import Container from "@/components/layout/Container";
import CtaLink from "@/components/ui/CtaLink";
import Reveal from "@/components/ui/Reveal";

export default function Philosophy() {
  return (
    <section className="bg-ivory py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="max-w-md">
              <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
                Philosophy
              </p>
              <h2 className="mt-4 font-display text-section text-obsidian">
                Made with Intention.
              </h2>
              <p className="mt-5 text-body text-graphite">
                Kami percaya secangkir kopi yang diseduh dengan sungguh-sungguh
                bisa mengubah ritme hari. Di Smiljan, setiap racikan dibuat
                perlahan, dari biji yang dipilih hingga cara penyajiannya.
              </p>
              <p className="mt-4 text-body text-graphite">
                Bukan sekadar kafe — tapi ruang yang tenang untuk berhenti
                sejenak, bercakap, dan menikmati hal-hal sederhana yang baik.
              </p>
              <div className="mt-8">
                <CtaLink href="/our-story" variant="secondary" showArrow>
                  Our Story
                </CtaLink>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <Image
                src="/images/story/space.svg"
                alt="Placeholder: suasana editorial peralatan seduh dan biji kopi"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
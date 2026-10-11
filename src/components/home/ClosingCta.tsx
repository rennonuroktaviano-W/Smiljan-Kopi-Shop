import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";
import Container from "@/components/layout/Container";
import CtaLink from "@/components/ui/CtaLink";
import ExternalLink from "@/components/ui/ExternalLink";
import Reveal from "@/components/ui/Reveal";

export default function ClosingCta() {
  const whatsappHref = buildWhatsAppGeneralLink();

  return (
    <section className="bg-obsidian py-20 text-ivory md:py-28">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
              Order
            </p>
            <h2 className="mt-4 font-display text-section">
              Ready for a Good Cup?
            </h2>
            <p className="mt-5 text-body text-fog">
              Lihat menu, pilih favorit Anda, dan pesan untuk dibawa pulang.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <CtaLink href="/menu" variant="primary-on-dark" showArrow>
                Explore Menu
              </CtaLink>
              {whatsappHref ? (
                <ExternalLink href={whatsappHref} variant="secondary-on-dark">
                  Chat WhatsApp
                </ExternalLink>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
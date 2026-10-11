import Image from "next/image";
import { siteConfig } from "@/data/site";
import Container from "@/components/layout/Container";
import CtaLink from "@/components/ui/CtaLink";
import Reveal from "@/components/ui/Reveal";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-obsidian text-ivory">
      <Image
        src="/images/hero/hero-photo.svg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/70 to-transparent"
      />

      <Container className="pb-20 pt-36 md:pb-28">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-label font-semibold uppercase tracking-[0.34em] text-olive">
              Specialty Coffee
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-5 font-display text-hero text-ivory">
              {siteConfig.headline}
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-md text-sub text-fog">
              Thoughtfully brewed for your everyday ritual. A quiet place where
              good coffee, better days, and simpler conversations begin.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CtaLink href="/menu" variant="primary-on-dark" showArrow>
                Explore Menu
              </CtaLink>
              <CtaLink href="/our-story" variant="secondary-on-dark">
                Our Story
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
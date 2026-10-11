import Image from "next/image";
import { siteConfig } from "@/data/site";
import Container from "@/components/layout/Container";
import CtaLink from "@/components/ui/CtaLink";
import Reveal from "@/components/ui/Reveal";
import DevNotice from "@/components/ui/DevNotice";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-stone pt-4">
      <dt className="text-label font-semibold uppercase tracking-[0.22em] text-olive">
        {label}
      </dt>
      <dd className="mt-2 text-body text-graphite">{children}</dd>
    </div>
  );
}

export default function VisitSection() {
  const hasAddress = Boolean(siteConfig.addressLine1);
  const hasDirections = Boolean(siteConfig.mapsUrl);

  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <Image
                src="/images/cafe/interior.svg"
                alt="Placeholder: ilustrasi meja bar kafe yang minimal"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2 lg:col-span-6">
            <div className="lg:pl-10">
              <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
                Visit
              </p>
              <h2 className="mt-4 font-display text-section text-obsidian">
                Your Place for Good Coffee.
              </h2>

              {siteConfig.businessInfoReady ? null : (
                <div className="mt-5">
                  <DevNotice>
                    Alamat, jam operasional, dan tautan petunjuk arah masih
                    menunggu konfirmasi pemilik.
                  </DevNotice>
                </div>
              )}

              <dl className="mt-8 space-y-5">
                <InfoRow label="Alamat">
                  {hasAddress ? (
                    <>
                      {siteConfig.addressLine1}
                      {siteConfig.addressLine2 ? (
                        <>
                          <br />
                          {siteConfig.addressLine2}
                        </>
                      ) : null}
                    </>
                  ) : (
                    "Alamat resmi menunggu konfirmasi pemilik."
                  )}
                </InfoRow>
                <InfoRow label="Jam Operasional">
                  {"Jam operasional belum dikonfirmasi (placeholder)."}
                </InfoRow>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CtaLink href="/visit" variant="primary" showArrow>
                  Kunjungi Kami
                </CtaLink>
                {hasDirections ? (
                  <a
                    href={siteConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-obsidian/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
                  >
                    Directions
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
import type { Metadata } from "next";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";
import Container from "@/components/layout/Container";
import DevNotice from "@/components/ui/DevNotice";
import DisabledCta from "@/components/ui/DisabledCta";
import ExternalLink from "@/components/ui/ExternalLink";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Kunjungi",
  description:
    "Kunjungi SMILJAN untuk ngopi, bersantai, atau menemukan sudut tenang. Alamat dan jam buka akan segera diumumkan.",
};

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-stone pt-4">
      <dt className="text-label font-semibold uppercase tracking-[0.22em] text-olive-deep">
        {label}
      </dt>
      <dd className="mt-2 text-body text-graphite">{children}</dd>
    </div>
  );
}

export default function VisitPage() {
  const hasAddress = Boolean(siteConfig.addressLine1);
  const hasDirections = Boolean(siteConfig.mapsUrl);
  const whatsappHref = buildWhatsAppGeneralLink();

  return (
    <section className="bg-ivory pb-24 pt-28 md:pt-36">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive-deep">
              Visit
            </p>
            <h1 className="mt-4 font-display text-section text-obsidian">
              Kunjungi Kami.
            </h1>
            <p className="mt-5 text-body text-graphite">
              Singgah untuk minum kopi, bersantai, atau menemukan sudut tenang
              di tengah hari Anda.
            </p>
          </div>
        </Reveal>

        <div className="mt-6">
          <DevNotice>
            Alamat, jam buka, dan petunjuk arah akan kami umumkan segera.
          </DevNotice>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <ImageWithFallback
                src="/images/cafe/interior.svg"
                alt="Meja bar kafe yang minimal dalam nuansa hangat"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <dl className="space-y-5">
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
                  "Alamat akan segera diumumkan."
                )}
              </InfoRow>
              <InfoRow label="Jam Operasional">
                {"Jam buka segera diumumkan."}
              </InfoRow>
              <InfoRow label="Kontak">
                {whatsappHref ? (
                  <ExternalLink
                    href={whatsappHref}
                    ariaLabel="Hubungi kami melalui WhatsApp"
                  >
                    {siteConfig.whatsappNumber}
                  </ExternalLink>
                ) : (
                  "Nomor WhatsApp segera diumumkan."
                )}
              </InfoRow>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {whatsappHref ? (
                <ExternalLink href={whatsappHref}>Chat WhatsApp</ExternalLink>
              ) : (
                <DisabledCta label="WhatsApp segera hadir" />
              )}
              {hasDirections ? (
                <ExternalLink href={siteConfig.mapsUrl}>Petunjuk Arah</ExternalLink>
              ) : null}
            </div>

            <p className="mt-8 text-sm text-graphite">
              Belum yakin mau pesan dulu?{" "}
              <Link
                href="/menu"
                aria-label="Lihat menu sebelum datang"
                className="font-semibold text-obsidian underline decoration-olive underline-offset-4 transition-colors hover:text-graphite"
              >
                Lihat Menu
              </Link>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
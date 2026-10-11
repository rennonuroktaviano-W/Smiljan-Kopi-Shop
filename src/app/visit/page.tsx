import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";
import Container from "@/components/layout/Container";
import DevNotice from "@/components/ui/DevNotice";
import DisabledCta from "@/components/ui/DisabledCta";
import ExternalLink from "@/components/ui/ExternalLink";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Ayo kunjungi SMILJAN. Alamat, jam operasional, dan petunjuk arah menunggu konfirmasi pemilik.",
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
      <dt className="text-label font-semibold uppercase tracking-[0.22em] text-olive">
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
            <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
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
            Alamat, jam operasional, dan tautan petunjuk arah belum
            dikonfirmasi pemilik. WhatsApp hanya aktif setelah nomor diatur.
          </DevNotice>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <Image
                src="/images/cafe/interior.svg"
                alt="Placeholder: ilustrasi meja bar kafe yang minimal"
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
                  "Alamat resmi menunggu konfirmasi pemilik."
                )}
              </InfoRow>
              <InfoRow label="Jam Operasional">
                {"Jam operasional belum dikonfirmasi (placeholder)."}
              </InfoRow>
              <InfoRow label="Contact">
                {whatsappHref ? (
                  <ExternalLink
                    href={whatsappHref}
                    ariaLabel="Hubungi kami melalui WhatsApp"
                  >
                    {siteConfig.whatsappNumber}
                  </ExternalLink>
                ) : (
                  "Nomor WhatsApp belum dikonfigurasi."
                )}
              </InfoRow>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {whatsappHref ? (
                <ExternalLink href={whatsappHref}>Chat WhatsApp</ExternalLink>
              ) : (
                <DisabledCta label="WhatsApp belum aktif" />
              )}
              {hasDirections ? (
                <ExternalLink href={siteConfig.mapsUrl}>Directions</ExternalLink>
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
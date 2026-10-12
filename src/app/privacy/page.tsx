import type { Metadata } from "next";
import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";
import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi SMILJAN Kopi Shop: situs ini tidak memasang cookie dan tidak menyimpan data pribadi pengunjung. Analitik agregat tanpa cookie oleh Cloudflare Web Analytics.",
};

const LAST_UPDATED = "12 Oktober 2026";

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-stone pt-8">
      <h2 id={id} className="font-display text-sub text-obsidian">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-body text-graphite">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const whatsappHref = buildWhatsAppGeneralLink();

  return (
    <section className="bg-ivory pb-24 pt-28 md:pt-36">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive-deep">
              Privasi
            </p>
            <h1 className="mt-4 font-display text-section text-obsidian">
              Kebijakan Privasi.
            </h1>
            <p className="mt-5 text-body text-graphite">
              Kami menjaga data sesedikit mungkin: situs ini tidak memasang
              cookie dan tidak menyimpan data pribadi pengunjung. Terakhir
              diperbarui {LAST_UPDATED}.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-14 max-w-2xl">
          <div className="space-y-8">
            <PolicySection id="cookie" title="Cookie">
              <p>
                Situs ini tidak memasang cookie apa pun — tidak ada cookie
                iklan, pelacakan, maupun analitik pada perangkat Anda. Karena
                itu situs ini juga tidak menampilkan banner persetujuan cookie.
              </p>
            </PolicySection>

            <PolicySection id="analitik" title="Analitik">
              <p>
                Kami memakai Cloudflare Web Analytics untuk mengetahui jumlah
                kunjungan secara agregat. Layanan ini tidak memakai cookie dan
                tidak mengidentifikasi pengunjung secara pribadi. Data yang
                tercatat hanya ringkasan seperti halaman yang dikunjungi,
                sumber kunjungan, perkiraan wilayah, dan jenis perangkat.
              </p>
              <p>
                Cloudflare dapat memproses data teknis (termasuk alamat IP)
                untuk keamanan dan analitik sesuai{" "}
                <a
                  href="https://www.cloudflare.com/privacypolicy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-obsidian underline decoration-olive underline-offset-4 transition-colors hover:text-graphite"
                >
                  kebijakan privasi Cloudflare
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection id="pesanan" title="Pemesanan melalui WhatsApp">
              <p>
                Pemesanan dilakukan melalui aplikasi WhatsApp, bukan melalui
                formulir di situs ini. Saat Anda menekan tombol pesan, WhatsApp
                terbuka dan pesan Anda terkirim langsung ke kami. Pemrosesan
                data di dalam WhatsApp tunduk pada kebijakan privasi WhatsApp.
              </p>
            </PolicySection>

            <PolicySection id="data-langsung" title="Data yang Anda kirim langsung">
              <p>
                Situs ini tidak memiliki akun, formulir, atau basis data
                pelanggan, sehingga kami tidak menyimpan data pribadi
                pengunjung. Jika Anda menghubungi kami, kami hanya memakai
                informasi yang Anda kirim (misalnya nama dan pesanan) untuk
                melayani permintaan Anda.
              </p>
            </PolicySection>

            <PolicySection id="perubahan" title="Perubahan kebijakan">
              <p>
                Jika kebijakan ini berubah, kami memperbarui tanggal di bagian
                atas halaman dan menampilkan versi terbaru di alamat ini.
              </p>
            </PolicySection>

            <PolicySection id="kontak" title="Kontak">
              {whatsappHref ? (
                <p>
                  Pertanyaan tentang privasi?{" "}
                  <ExternalLink
                    href={whatsappHref}
                    ariaLabel="Hubungi kami melalui WhatsApp untuk pertanyaan privasi"
                  >
                    Hubungi kami melalui WhatsApp
                  </ExternalLink>
                </p>
              ) : (
                <p>
                  Nomor kontak resmi untuk pertanyaan privasi akan diumumkan
                  segera.
                </p>
              )}
            </PolicySection>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
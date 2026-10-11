import type { Metadata } from "next";
import { menuItems } from "@/data/menu";
import Container from "@/components/layout/Container";
import DevNotice from "@/components/ui/DevNotice";
import MenuGrid from "@/components/menu/MenuGrid";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Menu Kami",
  description:
    "Menu SMILJAN: kopi, minuman non-kopi, dan pilihan pastry. Pesan langsung melalui WhatsApp.",
};

export default function MenuPage() {
  return (
    <section className="bg-ivory pb-24 pt-28 md:pt-36">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-label font-semibold uppercase tracking-[0.3em] text-olive-deep">
              Menu
            </p>
            <h1 className="mt-4 font-display text-section text-obsidian">
              Menu Kami
            </h1>
            <p className="mt-5 text-body text-graphite">
              Pilih favorit Anda, lalu pesan langsung melalui WhatsApp.
            </p>
          </div>
        </Reveal>

        <div className="mt-6">
          <DevNotice>
            Menu di bawah ini sedang kami susun ulang. Harga dan ketersediaan
            akhir menyusul.
          </DevNotice>
        </div>

        <div className="mt-12">
          <MenuGrid items={menuItems} />
        </div>
      </Container>
    </section>
  );
}
import { signatureItems } from "@/data/menu";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaLink from "@/components/ui/CtaLink";
import ProductCard from "@/components/menu/ProductCard";
import Reveal from "@/components/ui/Reveal";

export default function SignatureMenu() {
  return (
    <section className="bg-ivory py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Signature"
            title="A Few Good Things."
            description="Beberapa menu pilihan yang kami racik setiap hari, disajikan dengan hati-hati."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {signatureItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 90}>
              <ProductCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="flex justify-center">
            <CtaLink href="/menu" variant="secondary" showArrow>
              View Full Menu
            </CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
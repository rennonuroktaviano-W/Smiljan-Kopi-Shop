import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";

export default function EditorialBreak() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-obsidian">
      <ImageWithFallback
        src="/images/story/editorial.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-obsidian/55" />

      <Container className="py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-section text-ivory">
              Setiap Cangkir Punya Ceritanya.
            </h2>
            <p className="mt-5 text-body text-fog">
              Dari tangan barista sampai cangkir Anda — setiap langkah kami
              kerjakan tanpa tergesa-gesa.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
import Image from "next/image";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";

export default function EditorialBreak() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-obsidian">
      <Image
        src="/images/story/barista.svg"
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
              Every Cup Has a Story.
            </h2>
            <p className="mt-5 text-body text-fog">
              Dari tangan barista hingga cangkir Anda — setiap langkah adalah
              bagian dari cerita yang kami jaga setiap hari.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
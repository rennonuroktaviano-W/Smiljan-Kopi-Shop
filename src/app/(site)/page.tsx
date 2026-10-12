import Hero from "@/components/home/Hero";
import SignatureMenu from "@/components/home/SignatureMenu";
import Philosophy from "@/components/home/Philosophy";
import EditorialBreak from "@/components/home/EditorialBreak";
import VisitSection from "@/components/home/VisitSection";
import ClosingCta from "@/components/home/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <SignatureMenu />
      <Philosophy />
      <EditorialBreak />
      <VisitSection />
      <ClosingCta />
    </>
  );
}
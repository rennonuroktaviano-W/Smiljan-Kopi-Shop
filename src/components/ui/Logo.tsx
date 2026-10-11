import { siteConfig } from "@/data/site";
import Link from "next/link";

interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

export default function Logo({ tone = "dark", className = "" }: LogoProps) {
  const isLight = tone === "light";
  return (
    <Link
      href="/"
      className={`group inline-flex flex-col leading-none ${className}`}
      aria-label={`${siteConfig.name} ${siteConfig.descriptor} - Beranda`}
    >
      <span
        className={`font-display text-xl font-semibold tracking-[0.22em] ${
          isLight ? "text-ivory" : "text-obsidian"
        }`}
      >
        {siteConfig.name}
      </span>
      <span
        className={`mt-1 text-[0.6rem] tracking-[0.52em] ${
          isLight ? "text-fog" : "text-graphite"
        }`}
      >
        {siteConfig.descriptor}
      </span>
    </Link>
  );
}
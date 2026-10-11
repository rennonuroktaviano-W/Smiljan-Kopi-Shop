import Link from "next/link";
import { ArrowIcon, CtaVariant, ctaClassNames } from "@/components/ui/cta";

interface CtaLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
  showArrow?: boolean;
  ariaLabel?: string;
}

export default function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = false,
  ariaLabel,
}: CtaLinkProps) {
  return (
    <Link href={href} className={`${ctaClassNames(variant)} ${className}`} aria-label={ariaLabel}>
      {children}
      {showArrow ? <ArrowIcon /> : null}
    </Link>
  );
}
import { ArrowIcon, CtaVariant, ctaClassNames } from "@/components/ui/cta";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
  showArrow?: boolean;
  ariaLabel?: string;
}

/**
 * Tautan eksternal dengan atribut keamanan (rel noopener) saat membuka
 * tab baru.
 */
export default function ExternalLink({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = false,
  ariaLabel,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${ctaClassNames(variant)} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
      {showArrow ? <ArrowIcon /> : null}
    </a>
  );
}
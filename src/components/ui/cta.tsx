export type CtaVariant =
  | "primary"
  | "primary-on-dark"
  | "secondary"
  | "secondary-on-dark";

export function ctaClassNames(variant: CtaVariant): string {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200";

  switch (variant) {
    case "primary":
      return `${base} bg-obsidian text-ivory hover:bg-graphite`;
    case "primary-on-dark":
      return `${base} bg-ivory text-obsidian hover:bg-stone`;
    case "secondary":
      return `${base} border border-obsidian/25 text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-ivory`;
    case "secondary-on-dark":
      return `${base} border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-obsidian`;
  }
}

export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
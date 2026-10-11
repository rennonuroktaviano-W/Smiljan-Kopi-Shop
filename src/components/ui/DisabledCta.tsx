interface DisabledCtaProps {
  label: string;
  hint?: string;
  className?: string;
}

/**
 * Tombol nonaktif yang jelas sebagai fallback ketika WhatsApp belum
 * dikonfigurasi. Tidak interaktif, namun tetap terlihat dan memberikan
 * keterangan lewat atribut title.
 */
export default function DisabledCta({
  label,
  hint = "Fitur belum aktif karena data belum dikonfigurasi.",
  className = "",
}: DisabledCtaProps) {
  return (
    <span
      aria-disabled="true"
      title={hint}
      className={`inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-stone px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-graphite ${className}`}
    >
      {label}
    </span>
  );
}
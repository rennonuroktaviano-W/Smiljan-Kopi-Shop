interface DisabledCtaProps {
  label: string;
  hint?: string;
  className?: string;
}

/**
 * Tombol nonaktif sebagai fallback ketika layanan belum tersedia (misalnya
 * WhatsApp belum siap). Tidak interaktif, tetap terlihat, dan memberi
 * keterangan lewat atribut title.
 */
export default function DisabledCta({
  label,
  hint = "Segera hadir — cek kembali dalam beberapa hari.",
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
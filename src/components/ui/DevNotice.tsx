import { siteConfig } from "@/data/site";

/**
 * Catatan development yang ditampilkan selama data bisnis belum
 * diverifikasi pemilik (NEXT_PUBLIC_BUSINESS_INFO_READY=false).
 */
export default function DevNotice({ children }: { children: React.ReactNode }) {
  if (siteConfig.businessInfoReady) return null;

  return (
    <p className="rounded-sm border border-stone bg-white/60 px-4 py-3 text-sm text-graphite">
      <span className="font-semibold uppercase tracking-wider text-olive-deep">
        Data placeholder&nbsp;—&nbsp;
      </span>
      {children}
    </p>
  );
}
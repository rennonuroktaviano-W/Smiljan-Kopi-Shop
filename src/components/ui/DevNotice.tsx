import { siteConfig } from "@/data/site";

/**
 * Catatan singkat yang tampil selama informasi bisnis belum lengkap
 * (NEXT_PUBLIC_BUSINESS_INFO_READY=false). Berbahasa netral/ramah.
 */
export default function DevNotice({ children }: { children: React.ReactNode }) {
  if (siteConfig.businessInfoReady) return null;

  return (
    <p className="rounded-sm border border-stone bg-white/60 px-4 py-3 text-sm text-graphite">
      {children}
    </p>
  );
}
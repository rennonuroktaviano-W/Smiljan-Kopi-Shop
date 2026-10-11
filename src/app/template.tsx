export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Page transition ringan per §12 (fade 200ms). Animasi di nonaktifkan oleh
  // aturan prefers-reduced-motion di globals.css; template di-remount pada
  // setiap navigasi sehingga fade terputar ulang.
  return <div className="page-anim">{children}</div>;
}
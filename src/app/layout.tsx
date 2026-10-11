import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SMILJAN — KOPI SHOP",
    template: "%s | SMILJAN",
  },
  description:
    "Smiljan Kopi Shop. Modern specialty coffee, thoughtfully brewed for your everyday ritual.",
  applicationName: "SMILJAN Kopi Shop",
  openGraph: {
    siteName: "SMILJAN Kopi Shop",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Langsung ke konten utama
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
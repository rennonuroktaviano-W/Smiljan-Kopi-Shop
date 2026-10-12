import { navLinks, siteConfig } from "@/data/site";
import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";
import Container from "@/components/layout/Container";
import Logo from "@/components/ui/Logo";

function FooterLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const common = "text-fog transition-colors hover:text-ivory";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={common}>
        {children}
      </a>
    );
  }
  return <a href={href} className={common}>{children}</a>;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsAppGeneralLink();
  const hasSocial = Boolean(siteConfig.instagramUrl || siteConfig.tiktokUrl);
  const hasContact = Boolean(whatsappHref || hasSocial);

  return (
    <footer className="bg-obsidian text-ivory">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-body text-fog">
            {siteConfig.tagline}
          </p>
        </div>

        <nav aria-label="Navigasi footer" className="md:col-span-3">
          <h2 className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
            Halaman
          </h2>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
            <li>
              <FooterLink href="/privacy">Kebijakan Privasi</FooterLink>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-label font-semibold uppercase tracking-[0.3em] text-olive">
            Kontak
          </h2>
          <ul className="mt-5 space-y-3">
            {whatsappHref ? (
              <li>
                <FooterLink href={whatsappHref} external>
                  WhatsApp
                </FooterLink>
              </li>
            ) : null}
            {siteConfig.instagramUrl ? (
              <li>
                <FooterLink href={siteConfig.instagramUrl} external>
                  Instagram
                </FooterLink>
              </li>
            ) : null}
            {siteConfig.tiktokUrl ? (
              <li>
                <FooterLink href={siteConfig.tiktokUrl} external>
                  TikTok
                </FooterLink>
              </li>
            ) : null}
            {!hasContact ? (
              <li className="text-fog">
                WhatsApp dan sosial media segera hadir.
              </li>
            ) : null}
          </ul>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name} {siteConfig.descriptor}. Hak cipta dilindungi.</p>
        </Container>
      </div>
    </footer>
  );
}
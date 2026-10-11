import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { MenuItem } from "@/types/menu";
import { formatCurrency } from "@/lib/format-currency";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import ExternalLink from "@/components/ui/ExternalLink";
import DisabledCta from "@/components/ui/DisabledCta";

function OrderAction({ item }: { item: MenuItem }) {
  if (item.availabilityStatus === "unavailable") {
    return <DisabledCta label="Sementara kosong" />;
  }

  if (item.availabilityStatus === "coming-soon") {
    return <DisabledCta label="Segera hadir" />;
  }

  const orderHref = buildWhatsAppOrderLink([{ name: item.name }]);

  if (!orderHref) {
    return <DisabledCta label="Pemesanan segera hadir" />;
  }

  return (
    <ExternalLink
      href={orderHref}
      variant="secondary"
      ariaLabel={`Pesan ${item.name} melalui WhatsApp`}
    >
      Pesan
    </ExternalLink>
  );
}

export default function ProductCard({
  item,
  heading = "h3",
}: {
  item: MenuItem;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  const available = item.availabilityStatus === "available";

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className={`object-cover transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:scale-[1.04] ${
              available ? "" : "opacity-60"
            }`}
          />
        ) : (
          <div
            role="img"
            aria-label={`Foto ${item.name} belum tersedia`}
            className={`flex h-full w-full items-center justify-center bg-stone/30 p-6 text-center text-label font-medium uppercase tracking-wider text-graphite ${
              available ? "" : "opacity-60"
            }`}
          >
            Foto menyusul
          </div>
        )}
        {!available ? (
          <span className="absolute left-3 top-3 rounded-full bg-obsidian/85 px-3 py-1 text-label font-medium uppercase tracking-wider text-ivory">
            {item.availabilityStatus === "unavailable" ? "Kosong" : "Segera"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <Heading className="font-display text-xl text-obsidian">{item.name}</Heading>
          <p
            className="shrink-0 text-price font-semibold text-obsidian"
            aria-label={
              item.price !== null
                ? `Harga ${item.name}: ${formatCurrency(item.price)}`
                : `Harga ${item.name} menyusul`
            }
          >
            {item.price !== null ? formatCurrency(item.price) : "Harga menyusul"}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-graphite">
          {item.description}
        </p>
        <div className="mt-3">
          <OrderAction item={item} />
        </div>
      </div>
    </article>
  );
}
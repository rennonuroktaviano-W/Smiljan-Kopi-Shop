import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { MenuItem } from "@/types/menu";
import { formatCurrency } from "@/lib/format-currency";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import ExternalLink from "@/components/ui/ExternalLink";
import DisabledCta from "@/components/ui/DisabledCta";

function OrderAction({ item }: { item: MenuItem }) {
  if (!item.available) {
    return <DisabledCta label="Sementara kosong" />;
  }

  const orderHref = buildWhatsAppOrderLink([{ name: item.name }]);

  if (!orderHref) {
    return <DisabledCta label="Pemesanan belum aktif" />;
  }

  return (
    <ExternalLink
      href={orderHref}
      variant="secondary"
      ariaLabel={`Pesan ${item.name} melalui WhatsApp`}
    >
      Order
    </ExternalLink>
  );
}

export default function ProductCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white">
        <ImageWithFallback
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className={`object-cover transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:scale-[1.04] ${
            item.available ? "" : "opacity-60"
          }`}
        />
        {!item.available ? (
          <span className="absolute left-3 top-3 rounded-full bg-obsidian/85 px-3 py-1 text-label font-medium uppercase tracking-wider text-ivory">
            Kosong
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-obsidian">{item.name}</h3>
          <p className="shrink-0 text-price font-semibold text-obsidian">
            {formatCurrency(item.price)}
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
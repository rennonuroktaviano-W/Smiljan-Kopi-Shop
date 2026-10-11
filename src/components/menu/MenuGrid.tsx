"use client";

import { useMemo, useState } from "react";
import type { MenuCategory, MenuItem } from "@/types/menu";
import { menuCategories } from "@/types/menu";
import ProductCard from "@/components/menu/ProductCard";

type FilterValue = MenuCategory | "all";

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...menuCategories,
];

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const visibleItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori menu"
        className="flex flex-wrap gap-2"
      >
        {filterOptions.map((option) => {
          const active = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                active
                  ? "bg-obsidian text-ivory"
                  : "border border-stone bg-transparent text-graphite hover:border-obsidian hover:text-obsidian"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {visibleItems.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-dashed border-stone py-20 text-center">
          <p className="font-display text-2xl text-obsidian">Belum ada produk.</p>
          <p className="mx-auto mt-3 max-w-sm text-body text-graphite">
            Kategori ini masih dikosongkan. Silakan pilih kategori lain atau
            kembali lagi nanti.
          </p>
        </div>
      )}
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, type CatalogItem } from "@/data/catalog";
import { MenuCard } from "./menu-card";

export function MenuBrowser({ items }: { items: CatalogItem[] }) {
  const params = useSearchParams();
  const initial = params.get("category") || "All";
  const [category, setCategory] = useState(initial);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filtered = useMemo(() => {
    let list = items.filter((i) => (category === "All" ? true : i.category === category));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
      );
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.basePricePaise - b.basePricePaise);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.basePricePaise - a.basePricePaise);
    if (sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [items, category, query, sort]);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="block max-w-md flex-1 text-sm">
          <span className="sr-only">Search menu</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes"
            className="h-11 w-full border border-white/15 bg-transparent px-4 outline-none"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.16em] text-white/50">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="ml-2 h-11 border border-white/15 bg-[#0b0b0c] px-3 text-white"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price · low</option>
            <option value="price-desc">Price · high</option>
          </select>
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`px-4 py-2 text-[11px] uppercase tracking-[0.16em] ${
              category === c ? "bg-[#E31C23] text-white" : "border border-white/15 text-white/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-white/50">No dishes match that search. Try another word or category.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

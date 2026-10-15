"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, MENU_FOOTNOTE, type CatalogItem } from "@/data/catalog";
import { MenuCard } from "@/components/menu/menu-card";

export function MenuSection({ items }: { items: CatalogItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <section id="menu" className="relative bg-[#171717] py-24 lg:py-32">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D32F2F]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D32F2F]">
              THE MENU
            </span>
            <span className="h-px w-8 bg-[#D32F2F]" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-5xl leading-[1.05] tracking-tight text-[#F5F5F5] sm:text-6xl lg:text-7xl">
            <span className="block">Authentic Korean</span>
            <span className="font-display-italic block text-[#D32F2F]">Flavors.</span>
          </h2>

          <p className="mt-8 text-base leading-relaxed text-[#B5B5B5]">
            Explore our signature Korean street-food favorites, from crispy fried chicken and bao
            buns to ramen, kimchi rice, and refreshing boba tea.
          </p>
        </div>

        {/* Category Pills matching screenshot 5/6 */}
        <div className="mb-14 flex flex-wrap justify-center gap-2">
          {["All", ...CATEGORIES].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                  isSelected
                    ? "bg-[#D32F2F] text-[#0f0f10]"
                    : "border border-[#2a2a2a] bg-transparent text-[#F5F5F5] hover:border-[#D32F2F]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3-Column Grid matching screenshots */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-14 max-w-3xl text-center text-xs italic text-[#8C8C8C]">
          ✦ {MENU_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { MENU_ITEMS, RESTAURANT } from "@/data/catalog";
import { FoodViewerLazy } from "@/components/food3d/food-viewer-lazy";

const signatureRamen = MENU_ITEMS.find((i) => i.id === "korean-ramen")!;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#262626] bg-[#0F0F10]">
      {/* Background Image with Dark Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/images/hero/hero-1.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F10] via-[#0F0F10]/90 to-transparent" />

      <div className="relative mx-auto grid min-h-[85vh] max-w-[1500px] items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
        {/* Left Column: Headlines */}
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[#D32F2F]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D32F2F]">
              AUTHENTIC KOREAN CUISINE · INDIRANAGAR · BENGALURU
            </span>
            <span className="h-px w-8 bg-[#D32F2F]" />
          </div>

          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-[#F5F5F5] sm:text-7xl lg:text-8xl">
            <span className="block">Authentic</span>
            <span className="font-display-italic block text-[#D32F2F]">Korean Flavours</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-[#B5B5B5] lg:text-lg">
            {RESTAURANT.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#reservations"
              className="inline-flex items-center justify-center bg-[#D32F2F] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#0f0f10] transition hover:bg-[#b71c1c] hover:text-white"
            >
              Reserve a Table
            </Link>
            <Link
              href="/#menu"
              className="inline-flex items-center justify-center border border-[#F5F5F5] bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#F5F5F5] transition hover:bg-white hover:text-[#0f0f10]"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive 3D Signature Showcase */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden border border-[#262626] bg-[#171717] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] bg-[#1a1a1b] px-4 py-3">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#D32F2F]">
                ★ 3D Signature Dish
              </span>
              <Link
                href="/dish/ramen"
                className="text-[10px] uppercase tracking-[0.18em] text-[#B5B5B5] hover:text-white"
              >
                Expand Build View ↗
              </Link>
            </div>

            <FoodViewerLazy item={signatureRamen} height={420} compact />

            <div className="flex items-center justify-between border-t border-[#262626] bg-[#121213] p-4 text-xs">
              <div>
                <p className="font-display text-lg font-medium text-[#F5F5F5]">
                  {signatureRamen.name}
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8C8C8C]">
                  Interactive 3D model with separate layers
                </p>
              </div>
              <Link
                href="/dish/ramen"
                className="rounded bg-[#D32F2F] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f0f10] hover:bg-[#b71c1c] hover:text-white"
              >
                Explode
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Banner matching live Koreyaki site */}
      <div className="relative border-t border-[#262626] bg-[#0F0F10]/95 backdrop-blur">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-y divide-[#262626] px-6 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-10">
          <div className="py-6 text-center">
            <div className="font-display text-3xl font-normal text-[#D32F2F]">4.1★</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8C8C8C]">
              Google Rating
            </div>
          </div>
          <div className="py-6 text-center">
            <div className="font-display text-3xl font-normal text-[#D32F2F]">50+</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8C8C8C]">
              Korean Dishes
            </div>
          </div>
          <div className="py-6 text-center">
            <div className="font-display text-3xl font-normal text-[#D32F2F]">Daily</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8C8C8C]">
              Fresh Ingredients
            </div>
          </div>
          <div className="py-6 text-center">
            <div className="font-display text-3xl font-normal text-[#D32F2F]">100%</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8C8C8C]">
              Authentic Flavours
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

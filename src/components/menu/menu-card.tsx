"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Minus, Plus, Box } from "lucide-react";
import { formatInrFromPaise, RESTAURANT, type CatalogItem } from "@/data/catalog";
import { DishBuildView } from "@/components/food3d/dish-build-view";

export function MenuCard({
  item,
  index = 0,
}: {
  item: CatalogItem;
  index?: number;
}) {
  const [qty, setQty] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const priceNumber = item.basePricePaise / 100;
  const totalStr = `₹${priceNumber * qty}`;

  const handleWhatsAppOrder = () => {
    const text = [
      `Hello ${RESTAURANT.name}! I would like to place an order.`,
      "",
      `Item: ${item.name}`,
      `Price: ${formatInrFromPaise(item.basePricePaise)}`,
      `Quantity: ${qty}`,
      `Total: ${totalStr}`,
      "",
      "Please confirm availability and delivery/pickup details.",
    ].join("\n");

    window.open(
      `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const isChefsPick = item.tags.includes("Chef's Pick");

  return (
    <>
      <article
        className="group relative flex flex-col overflow-hidden border border-[#2a2a2a] bg-[#171717] transition-all duration-300 hover:-translate-y-1 hover:border-[#383838]"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Image container */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setModalOpen(true);
          }}
          className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-black"
          aria-label={`Open 3D build view for ${item.name}`}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Chef's Pick badge matching screenshot 5 */}
          {isChefsPick && (
            <div className="absolute left-3 top-3 bg-[#D32F2F] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-black">
              ★ CHEF&apos;S PICK
            </div>
          )}

          {/* 3D Interactive pill */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white shadow-lg backdrop-blur">
            <Box size={11} className="text-[#D32F2F]" />
            3D BUILD VIEW
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Title & Price row */}
          <div className="mb-2.5 flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-normal leading-tight text-[#F5F5F5]">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-left hover:text-[#D32F2F]"
              >
                {item.name}
              </button>
            </h3>
            <div className="font-display-italic flex-shrink-0 text-xl font-normal text-[#D32F2F]">
              {formatInrFromPaise(item.basePricePaise)}
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-[#B5B5B5]">{item.description}</p>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-1.5 pt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#D32F2F]/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#D32F2F]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stepper + Order on WhatsApp row matching screenshots */}
          <div className="mt-auto flex flex-col gap-3 border-t border-[#2a2a2a] pt-5 sm:flex-row">
            {/* Quantity Stepper */}
            <div
              className="flex h-11 w-full items-center justify-between border border-[#2a2a2a] bg-transparent px-2 sm:w-28"
              aria-label={`Quantity for ${item.name}`}
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty === 1}
                className="flex h-full w-8 items-center justify-center text-white/70 transition hover:text-white disabled:opacity-30"
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold text-white">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                disabled={qty === 20}
                className="flex h-full w-8 items-center justify-center text-white/70 transition hover:text-white disabled:opacity-30"
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Bright Green WhatsApp Button matching screenshots */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="flex h-11 flex-1 items-center justify-center gap-2 bg-[#25D366] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#20ba59]"
              aria-label={`Order ${qty} ${item.name} on WhatsApp`}
            >
              <MessageCircle size={16} />
              ORDER ON WHATSAPP
            </button>
          </div>

          {/* Secondary 3D explore link */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] text-[#D32F2F] hover:underline"
            >
              ✦ Explode & Customize in 3D
            </button>
          </div>
        </div>
      </article>

      {/* DISH BUILD MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-[1400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <DishBuildView item={item} isModal onClose={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

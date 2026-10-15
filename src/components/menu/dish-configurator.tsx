"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { formatInrFromPaise, type CatalogItem } from "@/data/catalog";
import { defaultSelections, priceCustomizedItem, selectionSummary } from "@/lib/pricing";
import { useCart } from "@/store/cart-store";

export function DishConfigurator({ item }: { item: CatalogItem }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [selections, setSelections] = useState(() => defaultSelections(item.groups));
  const [feedback, setFeedback] = useState("");
  const priced = useMemo(() => priceCustomizedItem(item, selections, qty), [item, selections, qty]);
  const summary = selectionSummary(item, selections);

  return (
    <div className="space-y-5">
      {item.groups.map((group) => (
        <fieldset key={group.id} className="border border-white/10 p-4">
          <legend className="px-2 text-[10px] uppercase tracking-[0.2em] text-white/50">{group.name}</legend>
          {group.helper ? <p className="mb-3 text-xs leading-relaxed text-white/50">{group.helper}</p> : null}
          <div className="space-y-2">
            {group.options.map((option) => {
              const selected = selections[group.id] === option.id;
              return (
                <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="radio"
                    name={group.id}
                    checked={selected}
                    onChange={() => setSelections((s) => ({ ...s, [group.id]: option.id }))}
                    className="mt-1"
                  />
                  <span>
                    {option.label}
                    {option.pricePaise ? (
                      <span className="text-[#E31C23]"> · {formatInrFromPaise(option.pricePaise)}</span>
                    ) : (
                      <span className="text-white/40"> · no published surcharge</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-white/50" htmlFor="dish-notes">
          Kitchen note
        </label>
        <textarea
          id="dish-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Allergies or requests — the restaurant must confirm these."
          className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-36 items-center justify-between border border-white/15" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full w-10">
            <Minus size={14} className="mx-auto" />
          </button>
          <span className="text-sm font-semibold">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))} className="h-full w-10">
            <Plus size={14} className="mx-auto" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Live total</p>
          <p className="font-display text-3xl text-[#E31C23]">{formatInrFromPaise(priced.linePaise)}</p>
        </div>
      </div>

      <div className="border border-white/10 p-4 text-xs leading-relaxed text-white/55">
        <p>Base {formatInrFromPaise(priced.basePaise)} × {qty}</p>
        {summary.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="mt-2">Taxes as applicable — Koreyaki confirms the payable total on WhatsApp. No unpublished tax or delivery fee is added here.</p>
      </div>

      {priced.errors.length ? (
        <p className="text-sm text-red-300">{priced.errors.join(" ")}</p>
      ) : null}

      <button
        type="button"
        disabled={!item.available || priced.errors.length > 0}
        onClick={() => {
          add({ itemId: item.id, quantity: qty, selections, notes });
          setFeedback(`${item.name} added to cart`);
        }}
        className="h-12 w-full bg-[#E31C23] text-xs font-semibold uppercase tracking-[0.18em] disabled:opacity-40"
      >
        Add to cart
      </button>
      {feedback ? <p className="text-sm text-emerald-300" role="status">{feedback}</p> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MENU_ITEMS, formatInrFromPaise } from "@/data/catalog";
import { priceCart, selectionSummary } from "@/lib/pricing";
import { useCart } from "@/store/cart-store";

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const priced = useMemo(() => {
    const mapped = lines
      .map((line) => {
        const item = MENU_ITEMS.find((i) => i.id === line.itemId);
        if (!item) return null;
        return { item, selections: line.selections, quantity: line.quantity, line };
      })
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
    return { mapped, breakdown: priceCart(mapped) };
  }, [lines]);

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl">Your cart is empty</h1>
        <p className="mt-4 text-white/60">Add a dish from the menu. You can still open every plate in 3D first.</p>
        <Link href="/menu" className="mt-8 inline-block bg-[#E31C23] px-6 py-3 text-xs uppercase tracking-[0.18em]">
          Browse menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-5xl">Cart</h1>
      <p className="mt-2 text-sm text-white/50">Different customisations of the same dish stay as separate lines.</p>
      <ul className="mt-8 space-y-4">
        {priced.mapped.map(({ item, line }) => (
          <li key={line.key} className="border border-white/10 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href={`/menu/${item.slug}`} className="font-display text-2xl">
                  {item.name}
                </Link>
                <p className="text-sm text-white/50">{formatInrFromPaise(item.basePricePaise)} each</p>
                {selectionSummary(item, line.selections).map((s) => (
                  <p key={s} className="text-xs text-white/45">
                    {s}
                  </p>
                ))}
                {line.notes ? <p className="text-xs text-white/45">Note: {line.notes}</p> : null}
              </div>
              <p className="font-display-italic text-xl text-[#E31C23]">
                {formatInrFromPaise(item.basePricePaise * line.quantity)}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="text-xs uppercase tracking-[0.14em] text-white/40">
                Qty
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={line.quantity}
                  onChange={(e) => setQuantity(line.key, Number(e.target.value))}
                  className="ml-2 h-9 w-16 border border-white/15 bg-transparent px-2"
                />
              </label>
              <Link href={`/menu/${item.slug}`} className="text-xs uppercase tracking-[0.14em] text-white/60">
                Edit in 3D
              </Link>
              <button type="button" onClick={() => remove(line.key)} className="text-xs uppercase tracking-[0.14em] text-red-300">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 border border-white/10 p-5">
        <p className="flex justify-between text-sm">
          <span>Menu subtotal</span>
          <span>{formatInrFromPaise(priced.breakdown.subtotalPaise)}</span>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-white/45">{priced.breakdown.taxNote}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/45">{priced.breakdown.deliveryNote}</p>
        {priced.breakdown.errors.length ? (
          <p className="mt-3 text-sm text-red-300">{priced.breakdown.errors.join(" ")}</p>
        ) : null}
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center bg-[#E31C23] text-xs font-semibold uppercase tracking-[0.18em]"
        >
          Continue to WhatsApp checkout
        </Link>
      </div>
    </main>
  );
}

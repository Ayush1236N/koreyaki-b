"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart-store";

export function QuickAdd({ itemId, name }: { itemId: string; name: string }) {
  const add = useCart((s) => s.add);
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Add ${name} to cart`}
      onClick={() => {
        add({ itemId, quantity: 1, selections: {}, notes: "" });
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex h-11 items-center justify-center gap-2 bg-[#25D366] text-xs font-semibold uppercase tracking-[0.12em] text-white"
    >
      {done ? <Check size={14} /> : <ShoppingBag size={14} />}
      {done ? "Added" : "Quick add"}
    </button>
  );
}

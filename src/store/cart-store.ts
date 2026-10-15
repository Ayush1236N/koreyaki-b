"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectionMap } from "@/lib/pricing";

export type CartLine = {
  key: string;
  itemId: string;
  quantity: number;
  selections: SelectionMap;
  notes: string;
};

function lineKey(itemId: string, selections: SelectionMap, notes: string): string {
  return `${itemId}::${JSON.stringify(selections)}::${notes.trim()}`;
}

type CartState = {
  lines: CartLine[];
  add: (input: { itemId: string; quantity: number; selections: SelectionMap; notes?: string }) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  updateLine: (key: string, patch: Partial<Pick<CartLine, "quantity" | "selections" | "notes">>) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: ({ itemId, quantity, selections, notes = "" }) => {
        const key = lineKey(itemId, selections, notes);
        const existing = get().lines.find((l) => l.key === key);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.key === key ? { ...l, quantity: Math.min(20, l.quantity + quantity) } : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            { key, itemId, quantity: Math.min(20, Math.max(1, quantity)), selections, notes },
          ],
        });
      },
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      setQuantity: (key, quantity) => {
        if (quantity < 1) {
          set({ lines: get().lines.filter((l) => l.key !== key) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(20, quantity) } : l)),
        });
      },
      updateLine: (key, patch) => {
        set({
          lines: get().lines.map((l) => {
            if (l.key !== key) return l;
            const next = { ...l, ...patch };
            return { ...next, key: lineKey(next.itemId, next.selections, next.notes) };
          }),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "koreyaki-cart" },
  ),
);

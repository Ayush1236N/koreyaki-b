"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MENU_ITEMS, formatInrFromPaise } from "@/data/catalog";
import { priceCart } from "@/lib/pricing";
import { useCart } from "@/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ orderId: string; whatsappUrl: string; subtotalPaise: number } | null>(null);

  const breakdown = useMemo(() => {
    const mapped = lines
      .map((line) => {
        const item = MENU_ITEMS.find((i) => i.id === line.itemId);
        return item ? { item, selections: line.selections, quantity: line.quantity } : null;
      })
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
    return priceCart(mapped);
  }, [lines]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          fulfillment,
          notes,
          lines: lines.map((l) => ({
            itemId: l.itemId,
            quantity: l.quantity,
            selections: l.selections,
            notes: l.notes,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create order draft");
      setResult(data);
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  if (lines.length === 0 && !result) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Nothing to check out</h1>
        <Link href="/menu" className="mt-6 inline-block text-[#E31C23]">
          Return to menu
        </Link>
      </main>
    );
  }

  if (result) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-300">Draft sent</p>
        <h1 className="font-display mt-3 text-4xl">WhatsApp opened</h1>
        <p className="mt-4 text-white/65">
          Draft {result.orderId.slice(0, 8).toUpperCase()} · menu subtotal {formatInrFromPaise(result.subtotalPaise)}. This
          is not a confirmed order until Koreyaki replies with availability and the payable total.
        </p>
        <a href={result.whatsappUrl} className="mt-6 inline-block bg-[#25D366] px-6 py-3 text-xs uppercase tracking-[0.16em] text-white">
          Reopen WhatsApp
        </a>
        <button type="button" onClick={() => router.push("/menu")} className="mt-4 block w-full text-sm text-white/50">
          Keep browsing
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-14">
      <h1 className="font-display text-5xl">Checkout</h1>
      <p className="mt-3 text-sm text-white/60">
        Koreyaki confirms orders on WhatsApp. We never collect card numbers on this website.
      </p>
      <p className="mt-4 text-sm">
        Menu subtotal <span className="text-[#E31C23]">{formatInrFromPaise(breakdown.subtotalPaise)}</span>
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-xs uppercase tracking-[0.16em] text-white/50">
          Name *
          <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11 w-full border border-white/15 bg-transparent px-3 text-sm text-white" />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-white/50">
          Phone *
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-11 w-full border border-white/15 bg-transparent px-3 text-sm text-white" />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-white/50">
          Fulfillment
          <select
            value={fulfillment}
            onChange={(e) => setFulfillment(e.target.value)}
            className="mt-2 h-11 w-full border border-white/15 bg-[#0b0b0c] px-3 text-sm"
          >
            <option>Pickup</option>
            <option>Dine-in</option>
            <option>Ask about delivery on WhatsApp</option>
          </select>
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-white/50">
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm" />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button disabled={busy} className="h-12 w-full bg-[#25D366] text-xs font-semibold uppercase tracking-[0.16em] text-white">
          {busy ? "Validating…" : "Validate & open WhatsApp"}
        </button>
      </form>
    </main>
  );
}

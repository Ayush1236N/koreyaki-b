"use client";

import { useState } from "react";
import { formatInrFromPaise, type CatalogItem } from "@/data/catalog";

export function AdminMenuTable({ items }: { items: CatalogItem[] }) {
  const [rows, setRows] = useState(items);
  const [status, setStatus] = useState("");

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setStatus("Update failed");
      return;
    }
    setStatus("Saved");
    setRows((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              available: typeof body.available === "boolean" ? body.available : item.available,
              featured: typeof body.featured === "boolean" ? body.featured : item.featured,
              description: typeof body.description === "string" ? body.description : item.description,
              basePricePaise: typeof body.basePricePaise === "number" ? body.basePricePaise : item.basePricePaise,
            }
          : item,
      ),
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
      {rows.map((item) => (
        <article key={item.id} className="border border-white/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl">{item.name}</h2>
            <p className="text-[#E31C23]">{formatInrFromPaise(item.basePricePaise)}</p>
          </div>
          <textarea
            defaultValue={item.description}
            onBlur={(e) => {
              if (e.target.value !== item.description) void patch(item.id, { description: e.target.value });
            }}
            className="mt-3 w-full border border-white/10 bg-transparent p-2 text-sm"
            rows={2}
          />
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={item.available} onChange={(e) => void patch(item.id, { available: e.target.checked })} />
              Available
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={item.featured} onChange={(e) => void patch(item.id, { featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2">
              Price ₹
              <input
                type="number"
                defaultValue={item.basePricePaise / 100}
                className="h-8 w-24 border border-white/15 bg-transparent px-2"
                onBlur={(e) => {
                  const rupees = Number(e.target.value);
                  if (Number.isFinite(rupees) && rupees > 0) void patch(item.id, { basePricePaise: Math.round(rupees * 100) });
                }}
              />
            </label>
          </div>
        </article>
      ))}
    </div>
  );
}

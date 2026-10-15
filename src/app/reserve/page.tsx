"use client";

import { useState } from "react";
import { RESTAURANT } from "@/data/catalog";

export default function ReservePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: RESTAURANT.timeSlots[3] as string,
    guests: RESTAURANT.partySize[0] as string,
    occasion: RESTAURANT.occasions[0] as string,
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send reservation");
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      setDone("WhatsApp opened. Koreyaki confirms tables during operating hours.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero/hero-1.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#E31C23]">Reservations</p>
          <h1 className="font-display mt-3 text-5xl">
            Reserve
            <span className="font-display-italic block text-[#E31C23]">Your Table</span>
          </h1>
          <p className="mt-6 text-white/65">
            Planning a visit to Koreyaki? Reserve in advance. Walk-ins are always welcome, subject to availability. For
            the quickest confirmation, contact us via WhatsApp or phone.
          </p>
          <div className="mt-8 space-y-2 text-sm text-white/70">
            <p>{RESTAURANT.address.line2}</p>
            <p>{RESTAURANT.address.line3}</p>
            <p>{RESTAURANT.hours}</p>
            <a href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a>
          </div>
        </div>
        <form onSubmit={submit} className="border border-white/10 bg-[#0f0c0c]/90 p-6 lg:col-span-7 lg:p-10">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name *">
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <Field label="Phone *">
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full bg-transparent text-sm outline-none" />
            </Field>
          </div>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-transparent text-sm outline-none" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date *">
              <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <Field label="Time">
              <select value={form.time} onChange={(e) => set("time", e.target.value)} className="w-full bg-transparent text-sm outline-none">
                {RESTAURANT.timeSlots.map((t) => (
                  <option key={t} className="bg-black">
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Guests">
              <select value={form.guests} onChange={(e) => set("guests", e.target.value)} className="w-full bg-transparent text-sm outline-none">
                {RESTAURANT.partySize.map((t) => (
                  <option key={t} className="bg-black">
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Occasion">
              <select value={form.occasion} onChange={(e) => set("occasion", e.target.value)} className="w-full bg-transparent text-sm outline-none">
                {RESTAURANT.occasions.map((t) => (
                  <option key={t} className="bg-black">
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Notes (allergies, special requests)">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full resize-none bg-transparent text-sm outline-none" />
          </Field>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {done ? <p className="text-sm text-emerald-300">{done}</p> : null}
          <button disabled={busy} className="mt-4 h-12 w-full bg-[#E31C23] text-xs uppercase tracking-[0.2em]">
            {busy ? "Opening WhatsApp…" : "Reserve via WhatsApp"}
          </button>
          <p className="mt-3 text-center text-xs italic text-white/45">We confirm reservations within 30 minutes during operating hours</p>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block border border-white/10 bg-black/40 px-4 py-2">
      <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40">{label}</span>
      {children}
    </label>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle, Check } from "lucide-react";
import { RESTAURANT } from "@/data/catalog";

export function ReservationsSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "8:00 PM",
    guests: "1-2 Guests",
    occasion: "Casual Dining",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const message = [
      `*New Reservation — ${RESTAURANT.name}*`,
      "",
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      form.email ? `*Email:* ${form.email}` : null,
      `*Date:* ${form.date}`,
      `*Time:* ${form.time}`,
      `*Guests:* ${form.guests}`,
      `*Occasion:* ${form.occasion}`,
      `*Notes:* ${form.notes || "None"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="reservations" className="relative overflow-hidden bg-[#0F0F10] py-24 lg:py-32">
      {/* Background with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/reservations/bg.jpg"
          alt="Koreyaki restaurant interior ambiance"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#0F0F10]/90" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Information */}
          <div className="lg:col-span-5">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#D32F2F]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D32F2F]">
                RESERVATIONS
              </span>
              <span className="h-px w-8 bg-[#D32F2F]" />
            </div>

            {/* Heading */}
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight text-[#F5F5F5] sm:text-6xl">
              <span className="block">Reserve</span>
              <span className="font-display-italic block text-[#D32F2F]">Your Table</span>
            </h2>

            <p className="mb-10 mt-8 text-base leading-relaxed text-[#B5B5B5]">
              Planning a visit to Koreyaki? Reserve your table in advance for a seamless dining
              experience. Walk-ins are always welcome, subject to availability. For the quickest
              confirmation, contact us via WhatsApp or phone.
            </p>

            {/* Info cards with red round icons */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D32F2F]/15 text-[#D32F2F]">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5B5B5]">ADDRESS</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[#F5F5F5]">
                    {RESTAURANT.address.line1}, {RESTAURANT.address.line2}, {RESTAURANT.address.line3}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D32F2F]/15 text-[#D32F2F]">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5B5B5]">CALL</p>
                  <a
                    href={RESTAURANT.phoneHref}
                    className="mt-0.5 block text-sm text-[#F5F5F5] hover:text-[#D32F2F]"
                  >
                    {RESTAURANT.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D32F2F]/15 text-[#D32F2F]">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5B5B5]">EMAIL</p>
                  <a
                    href={`mailto:${RESTAURANT.email}`}
                    className="mt-0.5 block text-sm text-[#F5F5F5] hover:text-[#D32F2F]"
                  >
                    {RESTAURANT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D32F2F]/15 text-[#D32F2F]">
                  <Clock size={18} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5B5B5]">HOURS</p>
                  <p className="mt-0.5 text-sm text-[#F5F5F5]">
                    Daily: 1:30 PM - 10:30 PM · Open Every Day
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form matching screenshot 3/4 */}
          <div id="contact" className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="border border-[#2a2a2a] bg-[#171717] p-6 sm:p-10"
            >
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                    NAME *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none placeholder:text-[#555]"
                  />
                </div>

                <div className="border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                    PHONE *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none placeholder:text-[#555]"
                  />
                </div>
              </div>

              <div className="mb-4 border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none placeholder:text-[#555]"
                />
              </div>

              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                    DATE *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none [color-scheme:dark]"
                  />
                </div>

                <div className="border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                    TIME
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none"
                  >
                    {RESTAURANT.timeSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#0F0F10] text-[#F5F5F5]">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                    GUESTS
                  </label>
                  <select
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none"
                  >
                    {RESTAURANT.partySize.map((p) => (
                      <option key={p} value={p} className="bg-[#0F0F10] text-[#F5F5F5]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                    OCCASION
                  </label>
                  <select
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] outline-none"
                  >
                    {RESTAURANT.occasions.map((occ) => (
                      <option key={occ} value={occ} className="bg-[#0F0F10] text-[#F5F5F5]">
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6 border border-[#2a2a2a] bg-[#0F0F10] px-4 py-2.5">
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8C8C8C]">
                  NOTES (ALLERGIES, SPECIAL REQUESTS)
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any dietary needs or requests..."
                  className="w-full resize-none bg-transparent text-sm text-[#F5F5F5] outline-none placeholder:text-[#555]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 bg-[#D32F2F] text-xs font-semibold uppercase tracking-[0.3em] text-[#0f0f10] transition hover:bg-[#b71c1c] hover:text-white disabled:opacity-50"
              >
                {submitted ? (
                  <>
                    <Check size={16} /> Opening WhatsApp...
                  </>
                ) : (
                  <>
                    RESERVE VIA WHATSAPP <MessageCircle size={16} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs italic text-[#8C8C8C]">
                We confirm reservations within 30 minutes during operating hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

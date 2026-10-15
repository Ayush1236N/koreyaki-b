import Image from "next/image";
import { ABOUT, RESTAURANT } from "@/data/catalog";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#E31C23]">{ABOUT.sectionLabel}</p>
      <h1 className="font-display mt-3 text-5xl">
        {ABOUT.heading.line1}
        <span className="font-display-italic block text-[#E31C23]">{ABOUT.heading.line2}</span>
      </h1>
      <div className="mt-8 overflow-hidden">
        <Image src="/images/about/about-1.jpg" alt="Koreyaki Indiranagar" width={1400} height={900} className="w-full object-cover" />
      </div>
      <div className="mt-8 space-y-4 text-white/70">
        {ABOUT.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ABOUT.pillars.map((p) => (
          <div key={p.title} className="border border-white/10 p-5">
            <h2 className="font-display text-2xl">{p.title}</h2>
            <p className="mt-2 text-sm text-white/55">{p.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-sm text-white/50">
        {RESTAURANT.address.line2}, {RESTAURANT.address.line3} · {RESTAURANT.hours}
      </p>
    </main>
  );
}

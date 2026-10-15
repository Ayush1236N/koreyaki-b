import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { MenuSection } from "@/components/home/menu-section";
import { ReservationsSection } from "@/components/home/reservations-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { FAQSection } from "@/components/home/faq-section";
import { ABOUT } from "@/data/catalog";
import { loadMenuFromDb } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await loadMenuFromDb();

  return (
    <main className="bg-[#0F0F10] text-[#F5F5F5]">
      {/* Hero Section */}
      <Hero />

      {/* About / Story Section */}
      <section id="about" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
          <div className="mb-24 grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Story Images */}
            <div className="relative lg:col-span-5">
              <div className="aspect-[4/5] overflow-hidden bg-black">
                <Image
                  src="/images/about/about-1.jpg"
                  alt="Koreyaki restaurant entrance in Indiranagar"
                  width={900}
                  height={1125}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-6 hidden aspect-[4/3] w-2/3 overflow-hidden border-4 border-[#0F0F10] md:block">
                <Image
                  src="/images/about/about-2.jpg"
                  alt="Koreyaki evening outdoor ambiance"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Story Copy */}
            <div className="lg:col-span-7 lg:pl-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D32F2F]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D32F2F]">
                  {ABOUT.sectionLabel}
                </span>
                <span className="h-px w-8 bg-[#D32F2F]" />
              </div>

              <h2 className="font-display text-5xl leading-[1.05] tracking-tight text-[#F5F5F5] sm:text-6xl lg:text-7xl">
                <span className="block">{ABOUT.heading.line1}</span>
                <span className="font-display-italic block text-[#D32F2F]">{ABOUT.heading.line2}</span>
              </h2>

              <div className="mt-10 space-y-5 text-base leading-[1.7] text-[#B5B5B5] lg:text-lg">
                {ABOUT.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] md:grid-cols-2 lg:grid-cols-4">
            {ABOUT.pillars.map((pillar) => (
              <div key={pillar.title} className="bg-[#0F0F10] p-8">
                <span className="mb-4 block text-[10px] uppercase tracking-[0.24em] text-[#D32F2F]">
                  ✦ CRAFT
                </span>
                <h3 className="font-display mb-2 text-xl font-medium text-[#F5F5F5]">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#B5B5B5]">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Menu Section matching screenshots 5, 6, 9, 10 */}
      <MenuSection items={items} />

      {/* Reservations Section matching screenshots 3 & 4 */}
      <ReservationsSection />

      {/* Reviews Section matching screenshots 3 & 4 */}
      <ReviewsSection />

      {/* FAQ Section matching screenshots 3 & 4 */}
      <FAQSection />
    </main>
  );
}

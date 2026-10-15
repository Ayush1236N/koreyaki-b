"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/catalog";

export function ReviewsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const cur = TESTIMONIALS[index];

  return (
    <section className="relative bg-[#0F0F10] py-24 lg:py-32">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D32F2F]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D32F2F]">
              GUEST REVIEWS
            </span>
            <span className="h-px w-8 bg-[#D32F2F]" />
          </div>

          <h2 className="font-display text-5xl leading-[1.05] tracking-tight text-[#F5F5F5] sm:text-6xl lg:text-7xl">
            <span className="block">Loved by</span>
            <span className="font-display-italic block text-[#D32F2F]">Korean Food Lovers</span>
          </h2>
        </div>

        {/* Quote presentation matching screenshots 3/4 */}
        <div className="mx-auto max-w-4xl text-center">
          <Quote
            size={48}
            className="mx-auto mb-8 text-[#D32F2F] opacity-30"
            strokeWidth={1.2}
          />

          <blockquote className="font-display-italic mb-10 text-2xl font-normal leading-[1.4] text-[#F5F5F5] md:text-3xl lg:text-4xl">
            &ldquo;{cur.quote}&rdquo;
          </blockquote>

          <div className="font-display mb-10 text-lg font-medium text-[#F5F5F5]">
            {cur.name}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#2a2a2a] text-[#B5B5B5] transition hover:border-[#D32F2F] hover:text-white"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-1 transition-all ${
                    index === i ? "w-7 bg-[#D32F2F]" : "w-2 bg-[#2a2a2a]"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#2a2a2a] text-[#B5B5B5] transition hover:border-[#D32F2F] hover:text-white"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

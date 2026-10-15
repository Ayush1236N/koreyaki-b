"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/data/catalog";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="relative bg-[#171717] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        {/* Header */}
        <div className="mx-auto mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D32F2F]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D32F2F]">
              FAQ
            </span>
            <span className="h-px w-8 bg-[#D32F2F]" />
          </div>

          <h2 className="font-display text-4xl leading-tight text-[#F5F5F5] sm:text-5xl">
            <span className="block">Questions?</span>
            <span className="font-display-italic block text-[#D32F2F]">We&apos;ve got answers.</span>
          </h2>
        </div>

        {/* Accordions matching screenshot 3/4 */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-[#2a2a2a] bg-[#0F0F10] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-medium text-[#F5F5F5]">
                    {faq.question}
                  </span>
                  <span
                    className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                      isOpen
                        ? "border-[#D32F2F] bg-[#D32F2F] text-black"
                        : "border-[#D32F2F] bg-transparent text-[#D32F2F]"
                    }`}
                  >
                    {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-[#B5B5B5]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

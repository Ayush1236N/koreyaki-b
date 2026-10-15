"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
import { RESTAURANT } from "@/data/catalog";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside aria-label="Quick actions" className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2">
      {/* Scroll to Top */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="grid h-10 w-10 place-items-center border border-[#D32F2F] bg-[#1a1208]/90 text-[#D32F2F] shadow-lg transition hover:bg-[#D32F2F] hover:text-white"
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* Call Button */}
      <a
        href={RESTAURANT.phoneHref}
        className="grid h-10 w-10 place-items-center border border-[#D32F2F] bg-[#1a1208]/90 text-[#D32F2F] shadow-lg transition hover:bg-[#D32F2F] hover:text-white"
        aria-label="Call Koreyaki"
      >
        <Phone size={16} />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${RESTAURANT.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </aside>
  );
}

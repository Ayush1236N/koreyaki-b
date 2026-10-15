"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart-store";
import { RESTAURANT } from "@/data/catalog";

export function SiteHeader() {
  const pathname = usePathname();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#262626] bg-[#0f0f10]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">
        {/* Logo matching screenshots */}
        <Link href="/" className="group flex flex-col leading-none" aria-label="Koreyaki Restaurant">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-px w-6 bg-[#D32F2F]" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.32em] text-[#D32F2F]">
              KOREAN RESTAURANT
            </span>
            <span className="h-px w-6 bg-[#D32F2F]" />
          </div>
          <span className="font-display text-3xl font-medium tracking-tight text-[#F5F5F5]">
            {RESTAURANT.name}
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary navigation">
          <Link
            href="/#menu"
            className="text-xs uppercase tracking-[0.24em] text-[#B5B5B5] transition hover:text-[#F5F5F5]"
          >
            Menu
          </Link>
          <Link
            href="/#about"
            className="text-xs uppercase tracking-[0.24em] text-[#B5B5B5] transition hover:text-[#F5F5F5]"
          >
            Story
          </Link>
          <Link
            href="/#contact"
            className="text-xs uppercase tracking-[0.24em] text-[#B5B5B5] transition hover:text-[#F5F5F5]"
          >
            Contact
          </Link>
          <Link
            href="/coverage"
            className="text-xs uppercase tracking-[0.24em] text-[#B5B5B5] transition hover:text-[#F5F5F5]"
          >
            3D Coverage
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:text-white"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={17} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#D32F2F] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/#reservations"
            className="hidden items-center justify-center rounded-none bg-[#D32F2F] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f0f10] transition hover:bg-[#b71c1c] hover:text-white sm:inline-flex"
          >
            Reserve
          </Link>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-white/15 text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#262626] bg-[#0f0f10] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4 text-sm uppercase tracking-[0.2em]">
            <Link href="/#menu" onClick={() => setOpen(false)} className="text-white/80">
              Menu
            </Link>
            <Link href="/#about" onClick={() => setOpen(false)} className="text-white/80">
              Story
            </Link>
            <Link href="/#contact" onClick={() => setOpen(false)} className="text-white/80">
              Contact
            </Link>
            <Link href="/coverage" onClick={() => setOpen(false)} className="text-white/80">
              3D Coverage
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="text-white/80">
              Cart ({count})
            </Link>
            <Link
              href="/#reservations"
              onClick={() => setOpen(false)}
              className="mt-2 block bg-[#D32F2F] py-3 text-center font-semibold text-black"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

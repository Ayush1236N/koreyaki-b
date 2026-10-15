import Link from "next/link";
import { RESTAURANT } from "@/data/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#262626] bg-[#0A0A0B] px-6 py-20 text-[#B5B5B5] lg:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-6 bg-[#D32F2F]" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.32em] text-[#D32F2F]">
              KOREAN RESTAURANT
            </span>
          </div>
          <span className="font-display text-4xl font-normal text-[#F5F5F5]">
            {RESTAURANT.name}
          </span>
          <p className="font-display mt-6 text-3xl font-normal leading-tight text-[#F5F5F5] sm:text-4xl">
            Experience <span className="font-display-italic text-[#D32F2F]">Korea.</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8C8C8C]">
            {RESTAURANT.description}
          </p>
        </div>

        {/* Center: Quick links */}
        <div className="lg:col-span-3">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D32F2F]">
            EXPLORE
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/#menu" className="transition hover:text-white">
                Menu & Online Ordering
              </Link>
            </li>
            <li>
              <Link href="/dish/ramen" className="transition hover:text-white">
                3D Food Visualization
              </Link>
            </li>
            <li>
              <Link href="/#about" className="transition hover:text-white">
                Our Story & Philosophy
              </Link>
            </li>
            <li>
              <Link href="/#reservations" className="transition hover:text-white">
                Table Reservations
              </Link>
            </li>
            <li>
              <Link href="/coverage" className="transition hover:text-white">
                3D Asset Registry & Coverage
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition hover:text-white">
                Review Order Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Contact & Hours */}
        <div className="lg:col-span-4">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D32F2F]">
            VISIT & CONNECT
          </p>
          <div className="space-y-3 text-sm leading-relaxed text-[#B5B5B5]">
            <p className="text-[#F5F5F5]">{RESTAURANT.address.line1}</p>
            <p>{RESTAURANT.address.line2}</p>
            <p>{RESTAURANT.address.line3}</p>
            <p className="pt-2 text-white/90">
              <span className="text-[#8C8C8C]">Phone / WhatsApp: </span>
              <a href={RESTAURANT.phoneHref} className="text-[#F5F5F5] hover:text-[#D32F2F]">
                {RESTAURANT.phone}
              </a>
            </p>
            <p>
              <span className="text-[#8C8C8C]">Email: </span>
              <a href={`mailto:${RESTAURANT.email}`} className="text-[#F5F5F5] hover:text-[#D32F2F]">
                {RESTAURANT.email}
              </a>
            </p>
            <p>
              <span className="text-[#8C8C8C]">Hours: </span>
              Daily 1:30 PM – 10:30 PM (Open every day)
            </p>
            <p className="pt-2">
              <a
                href={RESTAURANT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-[#D32F2F] hover:underline"
              >
                Follow @koreyaki_blr on Instagram ↗
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1500px] flex-col items-center justify-between gap-4 border-t border-[#1f1f20] pt-8 text-xs text-[#666] sm:flex-row">
        <p>© 2026 Koreyaki — Authentic Korean Restaurant. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/admin" className="hover:text-white">
            Staff Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { Suspense } from "react";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { MENU_FOOTNOTE } from "@/data/catalog";
import { loadMenuFromDb } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const items = await loadMenuFromDb();
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-10">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#E31C23]">The menu</p>
      <h1 className="font-display mt-3 text-5xl sm:text-6xl">
        Authentic Korean
        <span className="font-display-italic block text-[#E31C23]">Flavors.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-white/60">
        Prices and descriptions are taken from koreyaki.co. Every plate can be opened in 3D. Ordering is completed on
        WhatsApp so the kitchen can confirm availability.
      </p>
      <Suspense fallback={<p className="mt-10 text-white/50">Loading menu…</p>}>
        <MenuBrowser items={items} />
      </Suspense>
      <p className="mt-10 text-center text-xs italic text-white/40">✦ {MENU_FOOTNOTE}</p>
    </main>
  );
}

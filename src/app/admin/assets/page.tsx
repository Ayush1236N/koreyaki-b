import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { MENU_ITEMS } from "@/data/catalog";

export const dynamic = "force-dynamic";

export default async function AdminAssetsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl">3D asset registry</h1>
      <p className="mt-2 text-sm text-white/50">
        Each dish maps to a real glTF file in /public/models plus a matching procedural WebGL scene used in the viewer.
      </p>
      <div className="mt-8 space-y-4">
        {MENU_ITEMS.map((item) => (
          <article key={item.id} className="border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl">{item.name}</h2>
              <span className="text-xs uppercase tracking-[0.16em] text-[#E31C23]">{item.asset.status}</span>
            </div>
            <p className="mt-2 text-xs text-white/45">
              {item.asset.modelUrl} · exploded {item.asset.explodedReady ? "yes" : "no"}
            </p>
            <p className="mt-1 text-xs text-white/40">{item.asset.license}</p>
            <ul className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
              {item.asset.components.map((c) => (
                <li key={c.id} className="border border-white/10 px-3 py-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">{c.role}</span>
                  <p>{c.label}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}

import { coverageRows } from "@/data/catalog";
import { ensureSeed } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  await ensureSeed();
  const rows = coverageRows();
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-5xl">3D & menu coverage</h1>
      <p className="mt-4 max-w-2xl text-white/60">
        Inventory of the published Koreyaki.co menu. Every item can be ordered. 3D models are original multi-component
        WebGL assets with matching glTF files — not placeholder URLs.
      </p>
      <div className="mt-8 overflow-x-auto border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.16em] text-white/50">
            <tr>
              {["Dish", "Category", "Price", "Image", "Ingredients", "3D", "Exploded", "Customise", "Ordering"].map((h) => (
                <th key={h} className="px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-white/10">
                <td className="px-3 py-3">{r.item}</td>
                <td className="px-3 py-3 text-white/60">{r.category}</td>
                <td className="px-3 py-3">{r.verifiedBasePrice}</td>
                <td className="px-3 py-3">{r.image ? "Yes" : "No"}</td>
                <td className="px-3 py-3 text-white/60">{r.ingredientData}</td>
                <td className="px-3 py-3 text-[#E31C23]">{r.model}</td>
                <td className="px-3 py-3">{r.exploded ? "Ready" : "No"}</td>
                <td className="px-3 py-3 text-white/60">{r.customization}</td>
                <td className="px-3 py-3">{r.ordering}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

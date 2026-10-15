import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { coverageRows } from "@/data/catalog";
import { ensureSeed } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  await ensureSeed();
  const rows = coverageRows();
  const ready = rows.filter((r) => r.model === "MODEL_READY").length;
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl">Koreyaki staff</h1>
      <p className="mt-2 text-sm text-white/50">
        {ready}/{rows.length} dishes have 3D models. Orders are WhatsApp drafts until the kitchen confirms.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/menu" className="border border-white/10 p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#E31C23]">Menu</p>
          <p className="mt-2 font-display text-2xl">Availability & prices</p>
        </Link>
        <Link href="/admin/assets" className="border border-white/10 p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#E31C23]">3D assets</p>
          <p className="mt-2 font-display text-2xl">Model registry</p>
        </Link>
        <Link href="/admin/orders" className="border border-white/10 p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#E31C23]">Orders</p>
          <p className="mt-2 font-display text-2xl">WhatsApp drafts</p>
        </Link>
      </div>
    </main>
  );
}

import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { ensureSeed } from "@/lib/ensure-seed";
import { formatInrFromPaise } from "@/data/catalog";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  await ensureSeed();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl">Order drafts</h1>
      <p className="mt-2 text-sm text-white/50">
        These are WhatsApp handoffs. Status stays awaiting_whatsapp until the restaurant confirms off-platform. This
        dashboard cannot mark an order paid.
      </p>
      {rows.length === 0 ? (
        <p className="mt-10 text-white/50">No drafts yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((o) => (
            <li key={o.id} className="border border-white/10 p-4 text-sm">
              <p className="font-display text-xl">{o.customerName}</p>
              <p className="text-white/50">{o.customerPhone} · {o.fulfillment}</p>
              <p className="mt-1">{formatInrFromPaise(o.subtotalPaise)} · {o.status}</p>
              <p className="text-xs text-white/40">{o.createdAt.toISOString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

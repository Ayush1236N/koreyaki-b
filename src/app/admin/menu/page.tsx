import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loadMenuFromDb } from "@/lib/ensure-seed";
import { AdminMenuTable } from "@/components/admin/menu-table";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const items = await loadMenuFromDb();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl">Menu management</h1>
      <p className="mt-2 text-sm text-white/50">Edit published fields only. Do not invent dishes here without kitchen approval.</p>
      <AdminMenuTable items={items} />
    </main>
  );
}

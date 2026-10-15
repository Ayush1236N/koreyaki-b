import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { ensureSeed } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await ensureSeed();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return Response.json({ orders: rows });
}

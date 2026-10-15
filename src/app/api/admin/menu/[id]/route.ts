import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminAuditLogs, menuItems } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as {
    available?: boolean;
    featured?: boolean;
    description?: string;
    basePricePaise?: number;
  };
  const patch: {
    updatedAt: Date;
    available?: boolean;
    featured?: boolean;
    description?: string;
    basePricePaise?: number;
  } = { updatedAt: new Date() };
  if (typeof body.available === "boolean") patch.available = body.available;
  if (typeof body.featured === "boolean") patch.featured = body.featured;
  if (typeof body.description === "string") patch.description = body.description;
  if (typeof body.basePricePaise === "number" && Number.isInteger(body.basePricePaise) && body.basePricePaise > 0) {
    patch.basePricePaise = body.basePricePaise;
  }
  await db.update(menuItems).set(patch).where(eq(menuItems.id, id));
  await db.insert(adminAuditLogs).values({
    id: randomUUID(),
    action: "update_menu_item",
    entity: "menu_items",
    entityId: id,
    detail: JSON.stringify(patch),
  });
  return Response.json({ ok: true });
}

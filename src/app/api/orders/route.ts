import { randomUUID } from "crypto";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { loadMenuFromDb } from "@/lib/ensure-seed";
import { priceCart, type SelectionMap } from "@/lib/pricing";
import { orderWhatsAppMessage, waLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name?: string;
    phone?: string;
    fulfillment?: string;
    notes?: string;
    lines?: { itemId: string; quantity: number; selections: SelectionMap; notes?: string }[];
  };
  if (!body.name?.trim() || !body.phone?.trim()) {
    return Response.json({ error: "Name and phone are required." }, { status: 400 });
  }
  if (!body.lines?.length) {
    return Response.json({ error: "Cart is empty." }, { status: 400 });
  }

  const catalog = await loadMenuFromDb();
  const mapped = [];
  for (const line of body.lines) {
    const item = catalog.find((i) => i.id === line.itemId);
    if (!item) return Response.json({ error: "Unknown menu item in cart." }, { status: 400 });
    mapped.push({ item, quantity: line.quantity, selections: line.selections ?? {}, notes: line.notes });
  }

  let breakdown;
  try {
    breakdown = priceCart(mapped);
  } catch {
    return Response.json({ error: "Could not price cart." }, { status: 400 });
  }
  if (breakdown.errors.length) {
    return Response.json({ error: breakdown.errors.join(" "), breakdown }, { status: 400 });
  }

  const orderId = randomUUID();
  const message = orderWhatsAppMessage({
    orderId,
    name: body.name.trim(),
    phone: body.phone.trim(),
    fulfillment: body.fulfillment || "Pickup",
    notes: body.notes,
    lines: mapped.map((line, i) => ({
      item: line.item,
      quantity: line.quantity,
      selections: line.selections,
      notes: line.notes,
      unitPaise: breakdown.items[i].unitPaise,
      linePaise: breakdown.items[i].linePaise,
    })),
    subtotalPaise: breakdown.subtotalPaise,
  });
  const whatsappUrl = waLink(message);

  await db.insert(orders).values({
    id: orderId,
    status: "awaiting_whatsapp",
    customerName: body.name.trim(),
    customerPhone: body.phone.trim(),
    fulfillment: body.fulfillment || "Pickup",
    notes: body.notes,
    subtotalPaise: breakdown.subtotalPaise,
    whatsappUrl,
  });
  await db.insert(orderItems).values(
    mapped.map((line, i) => ({
      id: randomUUID(),
      orderId,
      itemId: line.item.id,
      name: line.item.name,
      quantity: line.quantity,
      selections: line.selections,
      notes: line.notes,
      unitPaise: breakdown.items[i].unitPaise,
      linePaise: breakdown.items[i].linePaise,
    })),
  );

  return Response.json({
    orderId,
    status: "awaiting_whatsapp",
    subtotalPaise: breakdown.subtotalPaise,
    whatsappUrl,
    notice: "Draft only. Koreyaki must confirm availability and the final payable total on WhatsApp.",
  });
}

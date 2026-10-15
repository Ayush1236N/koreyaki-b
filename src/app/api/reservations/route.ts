import { randomUUID } from "crypto";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { ensureSeed } from "@/lib/ensure-seed";
import { reservationWhatsAppMessage, waLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await ensureSeed();
  const body = (await req.json()) as {
    name?: string;
    phone?: string;
    email?: string;
    date?: string;
    time?: string;
    guests?: string;
    occasion?: string;
    notes?: string;
  };
  if (!body.name?.trim() || !body.phone?.trim() || !body.date) {
    return Response.json({ error: "Name, phone and date are required." }, { status: 400 });
  }
  const message = reservationWhatsAppMessage({
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: body.email,
    date: body.date,
    time: body.time || "",
    guests: body.guests || "",
    occasion: body.occasion || "",
    notes: body.notes,
  });
  const whatsappUrl = waLink(message);
  const id = randomUUID();
  await db.insert(reservations).values({
    id,
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: body.email,
    date: body.date,
    time: body.time || "",
    guests: body.guests || "",
    occasion: body.occasion || "",
    notes: body.notes,
    status: "awaiting_whatsapp",
    whatsappUrl,
  });
  return Response.json({ id, whatsappUrl, status: "awaiting_whatsapp" });
}

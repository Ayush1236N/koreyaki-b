import { loadMenuFromDb } from "@/lib/ensure-seed";
import { priceCustomizedItem, type SelectionMap } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    itemId?: string;
    quantity?: number;
    selections?: SelectionMap;
  };
  const items = await loadMenuFromDb();
  const item = items.find((i) => i.id === body.itemId);
  if (!item) return Response.json({ error: "Unknown item" }, { status: 400 });
  const priced = priceCustomizedItem(item, body.selections ?? {}, Number(body.quantity ?? 1));
  if (priced.errors.length) return Response.json({ error: priced.errors.join(" "), priced }, { status: 400 });
  return Response.json({ priced });
}

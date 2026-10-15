import { loadMenuFromDb } from "@/lib/ensure-seed";
import { priceCart, type SelectionMap } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    lines?: { itemId: string; quantity: number; selections: SelectionMap }[];
  };
  const catalog = await loadMenuFromDb();
  const lines = (body.lines ?? [])
    .map((line) => {
      const item = catalog.find((i) => i.id === line.itemId);
      return item ? { item, quantity: line.quantity, selections: line.selections ?? {} } : null;
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const breakdown = priceCart(lines);
  if (breakdown.errors.length) {
    return Response.json({ error: breakdown.errors.join(" "), breakdown }, { status: 400 });
  }
  return Response.json({ breakdown });
}

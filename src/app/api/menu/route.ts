import { toPublicItem } from "@/lib/menu-dto";
import { loadMenuFromDb } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await loadMenuFromDb();
  return Response.json({ items: items.map(toPublicItem) });
}

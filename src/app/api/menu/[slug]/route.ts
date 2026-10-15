import { toPublicItem } from "@/lib/menu-dto";
import { loadMenuFromDb } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await loadMenuFromDb();
  const item = items.find((i) => i.slug === slug);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item: toPublicItem(item) });
}

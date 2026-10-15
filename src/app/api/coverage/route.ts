import { coverageRows } from "@/data/catalog";
import { ensureSeed } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  return Response.json({ rows: coverageRows() });
}

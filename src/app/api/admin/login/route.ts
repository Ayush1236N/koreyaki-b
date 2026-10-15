import { setAdminCookie, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string };
  if (!body.password || !verifyPassword(body.password)) {
    return Response.json({ error: "Invalid staff password." }, { status: 401 });
  }
  await setAdminCookie();
  return Response.json({ ok: true });
}

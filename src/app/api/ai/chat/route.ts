import { randomUUID } from "crypto";
import { db } from "@/db";
import { aiConversations, aiMessages } from "@/db/schema";
import { assistantReply } from "@/lib/ai";
import { ensureSeed } from "@/lib/ensure-seed";

export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 20;
}

export async function POST(req: Request) {
  await ensureSeed();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ error: "Please wait a moment before sending more questions." }, { status: 429 });
  }
  const body = (await req.json()) as {
    message?: string;
    history?: { role: "user" | "assistant"; content: string }[];
  };
  const message = body.message?.trim();
  if (!message) return Response.json({ error: "Type a question first." }, { status: 400 });
  if (message.length > 800) return Response.json({ error: "Please keep questions shorter." }, { status: 400 });

  const reply = await assistantReply(message, body.history ?? []);
  const conversationId = randomUUID();
  try {
    await db.insert(aiConversations).values({ id: conversationId });
    await db.insert(aiMessages).values([
      { id: randomUUID(), conversationId, role: "user", content: message },
      { id: randomUUID(), conversationId, role: "assistant", content: reply.text },
    ]);
  } catch {
    // logging is best-effort
  }
  return Response.json(reply);
}

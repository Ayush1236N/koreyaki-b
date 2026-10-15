"use client";

import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; actions?: { label: string; href: string }[] };

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Annyeong — I’m the Koreyaki guide. Ask about the published menu, 3D dishes, hours in Indiranagar, or how WhatsApp ordering works. I won’t invent ingredients or prices.",
      actions: [
        { label: "Explore ramen in 3D", href: "/menu/korean-ramen" },
        { label: "Menu", href: "/menu" },
        { label: "Cart", href: "/cart" },
      ],
    },
  ]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: next.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assistant unavailable");
      setMessages((m) => [...m, { role: "assistant", content: data.text, actions: data.actions }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach the assistant");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#E31C23] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-xl"
        aria-label="Open Koreyaki assistant"
      >
        <MessageCircle size={16} />
        Guide
      </button>
      {open ? (
        <div
          className="fixed bottom-5 left-5 z-50 flex h-[min(72vh,560px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#141010] shadow-2xl"
          role="dialog"
          aria-label="Koreyaki restaurant assistant"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#E31C23]">Koreyaki guide</p>
              <p className="text-sm text-white/80">Grounded in the published menu</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="text-white/70">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-8 rounded-xl bg-[#E31C23] px-3 py-2" : "mr-6 rounded-xl bg-white/5 px-3 py-2"}>
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                {m.actions?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <Link
                        key={a.href + a.label}
                        href={a.href}
                        className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]"
                      >
                        {a.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {busy ? <p className="text-xs text-white/50">Checking the Koreyaki menu…</p> : null}
            {error ? <p className="text-xs text-red-300">{error}</p> : null}
          </div>
          <form
            className="flex gap-2 border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label className="sr-only" htmlFor="ky-guide">
              Ask the Koreyaki guide
            </label>
            <input
              id="ky-guide"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ramen, hours, spice…"
              className="h-10 flex-1 rounded-full border border-white/15 bg-black/40 px-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#E31C23] disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

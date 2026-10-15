import { FAQS, MENU_ITEMS, RESTAURANT, type CatalogItem } from "@/data/catalog";
import { formatInrFromPaise } from "@/data/catalog";

export type ChatAction = {
  type: "explore" | "customize" | "cart" | "reserve" | "menu" | "whatsapp";
  label: string;
  href: string;
};

export type ChatReply = {
  text: string;
  actions: ChatAction[];
  provider: "grounded-local" | "openai-grounded";
};

const GROUNDING = `
You are the Koreyaki restaurant guide for the Indiranagar, Bengaluru location.
Use only verified facts. Never invent ingredients, allergens, nutrition, prices, promotions, opening hours, or order status.
If unsure, say you cannot verify it and tell the guest to contact Koreyaki on WhatsApp or +91 95918 11065.
For allergy questions, never declare a dish safe. Direct them to the restaurant for ingredients and cross-contact.
Do not place orders or change carts unless the guest has already confirmed. You may propose a dish.
Prices on the public menu are subject to applicable taxes. This website does not apply an unpublished tax rate.
Ordering is completed by WhatsApp with the restaurant. Do not claim an order is confirmed.
`.trim();

function menuCard(item: CatalogItem): string {
  return `${item.name} — ${formatInrFromPaise(item.basePricePaise)} (${item.category}). ${item.description}`;
}

function retrieve(question: string): CatalogItem[] {
  const q = question.toLowerCase();
  const scored = MENU_ITEMS.map((item) => {
    const hay = `${item.name} ${item.description} ${item.category} ${item.tags.join(" ")} ${item.composition.join(" ")}`.toLowerCase();
    let score = 0;
    for (const word of q.split(/[^a-z0-9+]+/).filter((w) => w.length > 2)) {
      if (hay.includes(word)) score += 2;
      if (item.name.toLowerCase().includes(word)) score += 3;
    }
    if (q.includes("ramen") && item.id.includes("ramen")) score += 4;
    if (q.includes("chicken") && item.id.includes("chicken")) score += 4;
    if (q.includes("boba") && item.category === "Boba Tea") score += 4;
    if ((q.includes("bao") || q.includes("bun")) && item.id === "bao-buns") score += 4;
    if (q.includes("kimbap") && item.id === "kimbap") score += 4;
    if ((q.includes("tteok") || q.includes("rice cake")) && item.id === "tteokbokki") score += 4;
    if (q.includes("dumpling") && item.id === "dumplings") score += 4;
    if ((q.includes("corn") || q.includes("corndog")) && item.id === "corn-dogs") score += 4;
    if (q.includes("kimchi") && item.id.includes("kimchi")) score += 4;
    return { item, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.item);
}

export function groundedReply(message: string): ChatReply {
  const q = message.toLowerCase();
  const actions: ChatAction[] = [];
  const matches = retrieve(message);

  if (/allerg|gluten|nut-free|safe to eat|intoleran/.test(q)) {
    return {
      provider: "grounded-local",
      text: "I can’t confirm whether a dish is safe for your allergy from the public menu. Koreyaki publishes a general note that allergen information is available from the team, not a per-dish allergen chart. Please WhatsApp or call +91 95918 11065 and tell them your allergy so they can check ingredients and cross-contact.",
      actions: [
        { type: "whatsapp", label: "Message Koreyaki", href: `https://wa.me/${RESTAURANT.whatsapp}` },
        { type: "menu", label: "Browse menu", href: "/menu" },
      ],
    };
  }

  if (/hour|open|close|timing|when do you/.test(q)) {
    return {
      provider: "grounded-local",
      text: `${RESTAURANT.name} is open ${RESTAURANT.hours}. ${RESTAURANT.hoursNote}.`,
      actions: [{ type: "reserve", label: "Reserve a table", href: "/reserve" }],
    };
  }

  if (/where|address|location|indiranagar|map/.test(q)) {
    return {
      provider: "grounded-local",
      text: `${RESTAURANT.name} is at ${RESTAURANT.address.line2}, ${RESTAURANT.address.line3}.`,
      actions: [
        { type: "reserve", label: "Get directions", href: RESTAURANT.mapsUrl },
        { type: "reserve", label: "Reserve", href: "/reserve" },
      ],
    };
  }

  if (/vegetarian|veg only|eggetarian/.test(q)) {
    return {
      provider: "grounded-local",
      text: "Koreyaki offers vegetarian Korean dishes alongside the non-vegetarian menu. The public website does not mark every plate as veg or non-veg, so I won’t guess. Popular items that may have a vegetarian preparation — if the kitchen confirms — include kimchi fried rice, bao buns, dumplings, kimbap, tteokbokki and the boba drinks. Please confirm with the restaurant before ordering.",
      actions: [{ type: "menu", label: "View menu", href: "/menu" }],
    };
  }

  if (/reserve|table|book/.test(q)) {
    return {
      provider: "grounded-local",
      text: "Walk-ins are welcome, subject to availability. For the quickest confirmation, reserve by WhatsApp or phone. You can send the reservation form from this website straight to Koreyaki.",
      actions: [{ type: "reserve", label: "Reserve a table", href: "/reserve" }],
    };
  }

  if (/cart|checkout|order status|track/.test(q)) {
    return {
      provider: "grounded-local",
      text: "Orders from this website are sent to Koreyaki on WhatsApp. They are draft requests until the restaurant replies with availability and the final total. I can’t see live kitchen status from here.",
      actions: [
        { type: "cart", label: "Review cart", href: "/cart" },
        { type: "menu", label: "Add dishes", href: "/menu" },
      ],
    };
  }

  if (/3d|explod|ingredient view|customise|customize/.test(q)) {
    const dish = matches[0] ?? MENU_ITEMS.find((i) => i.id === "korean-ramen")!;
    return {
      provider: "grounded-local",
      text: `Every dish on the published menu has an interactive 3D view. Signature bowls such as ${dish.name} can be rotated, zoomed and opened into an exploded ingredient view built from separate 3D parts. Customisations only appear when they are configured from verified menu data — I won’t invent sauces or surcharges.`,
      actions: [
        { type: "explore", label: `Explore ${dish.name} in 3D`, href: `/menu/${dish.slug}` },
        { type: "menu", label: "All dishes", href: "/menu" },
      ],
    };
  }

  if (matches.length) {
    const lines = matches.map((item) => menuCard(item));
    for (const item of matches.slice(0, 3)) {
      actions.push({
        type: "explore",
        label: `Explore ${item.name}`,
        href: `/menu/${item.slug}`,
      });
    }
    actions.push({ type: "menu", label: "Full menu", href: "/menu" });
    return {
      provider: "grounded-local",
      text: `Here’s what I can verify from the Koreyaki menu:\n\n${lines.join("\n\n")}\n\nPrices are as published on koreyaki.co and are subject to applicable taxes. I can open any dish in 3D, but I won’t add it to your cart unless you confirm.`,
      actions,
    };
  }

  const faq = FAQS.find((f) => q.includes(f.question.toLowerCase().slice(0, 12)));
  if (faq) {
    return { provider: "grounded-local", text: faq.answer, actions: [{ type: "menu", label: "Menu", href: "/menu" }] };
  }

  return {
    provider: "grounded-local",
    text: `I can help with the published Koreyaki menu, 3D dish views, hours (${RESTAURANT.hours}), the Indiranagar address, and sending a WhatsApp order draft. Ask me about ramen, fried chicken, bao, kimbap or boba — or tell me you want something crispy, comforting or refreshing.`,
    actions: [
      { type: "menu", label: "Browse menu", href: "/menu" },
      { type: "explore", label: "Signature ramen in 3D", href: "/menu/korean-ramen" },
      { type: "reserve", label: "Reserve", href: "/reserve" },
    ],
  };
}

export async function assistantReply(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<ChatReply> {
  const local = groundedReply(message);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return local;

  try {
    const menuContext = MENU_ITEMS.map(
      (item) =>
        `${item.name} | ${formatInrFromPaise(item.basePricePaise)} | ${item.category} | ${item.description} | composition: ${item.composition.join(", ")}`,
    ).join("\n");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 400,
        messages: [
          { role: "system", content: `${GROUNDING}\n\nVerified menu:\n${menuContext}\n\nHours: ${RESTAURANT.hours}\nAddress: ${RESTAURANT.address.line2}, ${RESTAURANT.address.line3}\nPhone: ${RESTAURANT.phone}` },
          ...history.slice(-8),
          { role: "user", content: message },
        ],
      }),
    });
    clearTimeout(timer);
    if (!res.ok) return local;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return local;
    return { ...local, text, provider: "openai-grounded" };
  } catch {
    return local;
  }
}

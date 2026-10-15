import { formatInrFromPaise, RESTAURANT, type CatalogItem } from "@/data/catalog";
import { selectionSummary, type SelectionMap } from "@/lib/pricing";

export function waLink(text: string): string {
  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function orderWhatsAppMessage(input: {
  orderId: string;
  name: string;
  phone: string;
  fulfillment: string;
  notes?: string;
  lines: {
    item: CatalogItem;
    quantity: number;
    selections: SelectionMap;
    notes?: string;
    unitPaise: number;
    linePaise: number;
  }[];
  subtotalPaise: number;
}): string {
  const rows = input.lines.map((line, index) => {
    const extras = selectionSummary(line.item, line.selections);
    return [
      `${index + 1}. ${line.item.name} × ${line.quantity}`,
      `   ${formatInrFromPaise(line.linePaise)} (${formatInrFromPaise(line.unitPaise)} each)`,
      extras.length ? `   ${extras.join(" · ")}` : null,
      line.notes ? `   Note: ${line.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    `Hello ${RESTAURANT.name}! I would like to place an order.`,
    "",
    `Draft #${input.orderId.slice(0, 8).toUpperCase()}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Fulfillment: ${input.fulfillment}`,
    input.notes ? `Notes: ${input.notes}` : null,
    "",
    "Items:",
    ...rows,
    "",
    `Menu subtotal: ${formatInrFromPaise(input.subtotalPaise)}`,
    "Taxes as applicable — please confirm availability and the final payable total.",
    "This is a request from the Koreyaki website, not a confirmed order until you reply.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function reservationWhatsAppMessage(input: {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  notes?: string;
}): string {
  return [
    `Hello ${RESTAURANT.name}! I would like to reserve a table.`,
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : null,
    `Date: ${input.date}`,
    `Time: ${input.time}`,
    `Guests: ${input.guests}`,
    `Occasion: ${input.occasion}`,
    `Notes: ${input.notes || "None"}`,
    "",
    "Please confirm availability. Walk-ins are welcome if a table is free.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

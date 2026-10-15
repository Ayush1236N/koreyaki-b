import type { CatalogGroup, CatalogItem } from "@/data/catalog";

export type SelectionMap = Record<string, string | string[]>;

export type PriceAdjustment = {
  groupId: string;
  optionId: string;
  label: string;
  amountPaise: number;
};

export type ItemPriceBreakdown = {
  itemId: string;
  basePaise: number;
  adjustments: PriceAdjustment[];
  unitPaise: number;
  quantity: number;
  linePaise: number;
  errors: string[];
};

export type CartPriceBreakdown = {
  items: ItemPriceBreakdown[];
  subtotalPaise: number;
  taxNote: string;
  deliveryNote: string;
  payableEstimatePaise: number;
  errors: string[];
};

export function defaultSelections(groups: CatalogGroup[]): SelectionMap {
  const selections: SelectionMap = {};
  for (const group of groups) {
    if (group.control === "multi") {
      selections[group.id] = group.options.filter((o) => o.defaultSelected).map((o) => o.id);
    } else {
      const def = group.options.find((o) => o.defaultSelected) ?? (group.required ? group.options[0] : undefined);
      if (def) selections[group.id] = def.id;
    }
  }
  return selections;
}

export function priceCustomizedItem(
  item: CatalogItem,
  selections: SelectionMap,
  quantity: number,
): ItemPriceBreakdown {
  const errors: string[] = [];
  const qty = Number.isInteger(quantity) ? quantity : 0;
  if (qty < 1 || qty > 20) errors.push("Quantity must be between 1 and 20.");
  if (!item.available) errors.push(`${item.name} is currently unavailable.`);

  const adjustments: PriceAdjustment[] = [];
  let unit = item.basePricePaise;

  for (const group of item.groups) {
    const raw = selections[group.id];
    const selectedIds = Array.isArray(raw) ? raw : raw ? [raw] : [];

    if (group.required && selectedIds.length === 0) {
      errors.push(`${group.name} is required.`);
      continue;
    }

    if (group.control === "single" && selectedIds.length > 1) {
      errors.push(`Choose only one option for ${group.name}.`);
    }

    for (const optionId of selectedIds) {
      const option = group.options.find((o) => o.id === optionId);
      if (!option) {
        errors.push(`Invalid option on ${group.name}.`);
        continue;
      }
      if (option.pricePaise !== 0) {
        unit += option.pricePaise;
        adjustments.push({
          groupId: group.id,
          optionId: option.id,
          label: option.label,
          amountPaise: option.pricePaise,
        });
      } else if (option.id) {
        adjustments.push({
          groupId: group.id,
          optionId: option.id,
          label: option.label,
          amountPaise: 0,
        });
      }
    }
  }

  const safeQty = Math.min(20, Math.max(0, qty));
  const linePaise = unit * safeQty;
  return {
    itemId: item.id,
    basePaise: item.basePricePaise,
    adjustments,
    unitPaise: unit,
    quantity: safeQty,
    linePaise,
    errors,
  };
}

export function priceCart(
  lines: { item: CatalogItem; selections: SelectionMap; quantity: number }[],
): CartPriceBreakdown {
  const items = lines.map((line) => priceCustomizedItem(line.item, line.selections, line.quantity));
  const errors = items.flatMap((i) => i.errors);
  const subtotalPaise = items.reduce((sum, i) => sum + (i.errors.length ? 0 : i.linePaise), 0);
  return {
    items,
    subtotalPaise,
    taxNote: "All prices are subject to applicable taxes. Koreyaki confirms tax on WhatsApp — this site does not apply an unpublished tax rate.",
    deliveryNote: "Pickup and dine-in are supported. Delivery is arranged only if the restaurant confirms it on WhatsApp. No delivery fee is published.",
    payableEstimatePaise: subtotalPaise,
    errors,
  };
}

export function selectionSummary(item: CatalogItem, selections: SelectionMap): string[] {
  const lines: string[] = [];
  for (const group of item.groups) {
    const raw = selections[group.id];
    const ids = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const labels = ids
      .map((id) => group.options.find((o) => o.id === id)?.label)
      .filter((v): v is string => Boolean(v));
    if (labels.length) lines.push(`${group.name}: ${labels.join(", ")}`);
  }
  return lines;
}

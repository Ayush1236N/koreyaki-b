import type { CatalogItem } from "@/data/catalog";
import { formatInrFromPaise } from "@/data/catalog";

export type PublicMenuItem = CatalogItem & {
  priceLabel: string;
};

export function toPublicItem(item: CatalogItem): PublicMenuItem {
  return { ...item, priceLabel: formatInrFromPaise(item.basePricePaise) };
}

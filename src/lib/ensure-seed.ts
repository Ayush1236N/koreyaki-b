import { db } from "@/db";
import {
  customizationGroups,
  customizationOptions,
  foodModelAssets,
  menuCategories,
  menuItems,
  modelComponents,
  restaurantSettings,
} from "@/db/schema";
import { CATEGORIES, MENU_ITEMS, RESTAURANT, type CatalogItem } from "@/data/catalog";
import { sql } from "drizzle-orm";

let seeded = false;
let inflight: Promise<void> | null = null;

export async function ensureSeed(): Promise<void> {
  if (seeded) return;
  if (inflight) return inflight;
  inflight = (async () => {
    const result = await db.execute(sql`select count(*)::int as count from menu_items`);
    const row = result.rows[0] as { count: number };
    if (row.count > 0) {
      seeded = true;
      return;
    }

    await db
      .insert(restaurantSettings)
      .values({
        id: "koreyaki",
        name: RESTAURANT.name,
        phone: RESTAURANT.phone,
        whatsapp: RESTAURANT.whatsapp,
        email: RESTAURANT.email,
        addressJson: RESTAURANT.address,
        hours: RESTAURANT.hours,
        instagram: RESTAURANT.instagram,
      })
      .onConflictDoNothing();

    await db
      .insert(menuCategories)
      .values(CATEGORIES.map((name, index) => ({ id: slugify(name), name, sortOrder: index })))
      .onConflictDoNothing();

    for (const item of MENU_ITEMS) {
      await db
        .insert(menuItems)
        .values({
          id: item.id,
          slug: item.slug,
          name: item.name,
          categoryId: slugify(item.category),
          description: item.description,
          basePricePaise: item.basePricePaise,
          image: item.image,
          tags: [...item.tags],
          featured: item.featured,
          available: item.available,
          quickAdd: item.quickAdd,
          composition: [...item.composition],
          dietaryNote: item.dietaryNote,
          allergenNote: item.allergenNote,
        })
        .onConflictDoNothing();

      for (const [gIndex, group] of item.groups.entries()) {
        const groupId = `${item.id}:${group.id}`;
        await db
          .insert(customizationGroups)
          .values({
            id: groupId,
            itemId: item.id,
            name: group.name,
            control: group.control,
            required: group.required,
            helper: group.helper,
            sortOrder: gIndex,
          })
          .onConflictDoNothing();
        for (const [oIndex, option] of group.options.entries()) {
          await db
            .insert(customizationOptions)
            .values({
              id: `${groupId}:${option.id}`,
              groupId,
              label: option.label,
              pricePaise: option.pricePaise,
              componentId: option.componentId,
              defaultSelected: Boolean(option.defaultSelected),
              description: option.description,
              sortOrder: oIndex,
            })
            .onConflictDoNothing();
        }
      }

      const assetId = `asset-${item.id}`;
      await db
        .insert(foodModelAssets)
        .values({
          id: assetId,
          itemId: item.id,
          status: item.asset.status,
          kind: item.asset.kind,
          modelUrl: item.asset.modelUrl,
          previewImage: item.asset.previewImage,
          license: item.asset.license,
          cameraJson: item.asset.defaultCamera,
          explodedReady: item.asset.explodedReady,
          optimization: item.asset.optimization,
        })
        .onConflictDoNothing();

      for (const component of item.asset.components) {
        await db
          .insert(modelComponents)
          .values({
            id: `${assetId}:${component.id}`,
            assetId,
            componentKey: component.id,
            label: component.label,
            role: component.role,
            restPosition: component.restPosition,
            explodePosition: component.explodePosition,
            info: component.info,
            optional: Boolean(component.optional),
          })
          .onConflictDoNothing();
      }
    }

    seeded = true;
  })();
  try {
    await inflight;
  } finally {
    inflight = null;
  }
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function loadMenuFromDb(): Promise<CatalogItem[]> {
  await ensureSeed();
  const items = await db.select().from(menuItems);
  const groups = await db.select().from(customizationGroups);
  const options = await db.select().from(customizationOptions);

  const byId = new Map(MENU_ITEMS.map((item) => [item.id, item]));

  return items.flatMap((row) => {
    const fallback = byId.get(row.id);
    if (!fallback) return [];
    const itemGroups = groups
      .filter((g) => g.itemId === row.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((g) => ({
        id: g.id.split(":").slice(1).join(":") || g.id,
        name: g.name,
        control: g.control as "single" | "multi" | "stepper",
        required: g.required,
        helper: g.helper ?? undefined,
        options: options
          .filter((o) => o.groupId === g.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((o) => ({
            id: o.id.split(":").pop() || o.id,
            label: o.label,
            pricePaise: o.pricePaise,
            componentId: o.componentId ?? undefined,
            defaultSelected: o.defaultSelected,
            description: o.description ?? undefined,
          })),
      }));

    // 3D components come from the code-side registry (src/data/model-registry.ts),
    // which points at real GLB files. Stale seeded model rows are ignored on purpose.
    const asset = fallback.asset;

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: fallback?.category ?? row.categoryId,
      basePricePaise: row.basePricePaise,
      image: row.image,
      description: row.description,
      tags: row.tags,
      featured: row.featured,
      available: row.available,
      quickAdd: row.quickAdd,
      composition: row.composition,
      dietaryNote: row.dietaryNote,
      allergenNote: row.allergenNote,
      groups: itemGroups.length ? itemGroups : fallback?.groups ?? [],
      asset,
    };
  });
}

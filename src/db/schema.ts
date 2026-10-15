import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const restaurantSettings = pgTable("restaurant_settings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  addressJson: jsonb("address_json").notNull(),
  hours: text("hours").notNull(),
  instagram: text("instagram"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const menuCategories = pgTable("menu_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => menuCategories.id),
    description: text("description").notNull(),
    basePricePaise: integer("base_price_paise").notNull(),
    image: text("image").notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    available: boolean("available").notNull().default(true),
    quickAdd: boolean("quick_add").notNull().default(true),
    composition: jsonb("composition").$type<string[]>().notNull().default([]),
    dietaryNote: text("dietary_note").notNull(),
    allergenNote: text("allergen_note").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("menu_items_slug_idx").on(table.slug),
    index("menu_items_category_idx").on(table.categoryId),
  ],
);

export const customizationGroups = pgTable(
  "customization_groups",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    control: text("control").notNull(),
    required: boolean("required").notNull().default(false),
    helper: text("helper"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("customization_groups_item_idx").on(table.itemId)],
);

export const customizationOptions = pgTable(
  "customization_options",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => customizationGroups.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    pricePaise: integer("price_paise").notNull().default(0),
    componentId: text("component_id"),
    defaultSelected: boolean("default_selected").notNull().default(false),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("customization_options_group_idx").on(table.groupId)],
);

export const foodModelAssets = pgTable("food_model_assets", {
  id: text("id").primaryKey(),
  itemId: text("item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  kind: text("kind").notNull(),
  modelUrl: text("model_url"),
  previewImage: text("preview_image").notNull(),
  license: text("license").notNull(),
  cameraJson: jsonb("camera_json").notNull(),
  explodedReady: boolean("exploded_ready").notNull().default(false),
  optimization: text("optimization"),
});

export const modelComponents = pgTable(
  "model_components",
  {
    id: text("id").primaryKey(),
    assetId: text("asset_id")
      .notNull()
      .references(() => foodModelAssets.id, { onDelete: "cascade" }),
    componentKey: text("component_key").notNull(),
    label: text("label").notNull(),
    role: text("role").notNull(),
    restPosition: jsonb("rest_position").$type<[number, number, number]>().notNull(),
    explodePosition: jsonb("explode_position").$type<[number, number, number]>().notNull(),
    info: text("info").notNull(),
    optional: boolean("optional").notNull().default(false),
  },
  (table) => [index("model_components_asset_idx").on(table.assetId)],
);

export const carts = pgTable("carts", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => menuItems.id),
    quantity: integer("quantity").notNull(),
    selections: jsonb("selections").$type<Record<string, string | string[]>>().notNull(),
    notes: text("notes"),
    unitPaise: integer("unit_paise").notNull(),
    linePaise: integer("line_paise").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("cart_items_cart_idx").on(table.cartId)],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    fulfillment: text("fulfillment").notNull(),
    notes: text("notes"),
    subtotalPaise: integer("subtotal_paise").notNull(),
    whatsappUrl: text("whatsapp_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("orders_created_idx").on(table.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    selections: jsonb("selections").$type<Record<string, string | string[]>>().notNull(),
    notes: text("notes"),
    unitPaise: integer("unit_paise").notNull(),
    linePaise: integer("line_paise").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const reservations = pgTable("reservations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: text("guests").notNull(),
  occasion: text("occasion").notNull(),
  notes: text("notes"),
  status: text("status").notNull(),
  whatsappUrl: text("whatsapp_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  detail: text("detail"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const aiConversations = pgTable("ai_conversations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => aiConversations.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("ai_messages_convo_idx").on(table.conversationId)],
);

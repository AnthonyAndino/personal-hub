import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const wishlistItems = sqliteTable("wishlist_items", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    estimatedPrice: real("estimated_price").notNull(),
    savedAmount: real("save_amount").default(0).notNull(),
    priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium").notNull(),
    targetDate: text("target_date"),
    url: text("url"),
    notes: text("notes"),
    purchased: integer("purchased", { mode: "boolean" }).default(false).notNull(),
    createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString())
})
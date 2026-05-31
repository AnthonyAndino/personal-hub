import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    type: text("type", {enum: ["income", "expense"] }).notNull(),
    icon: text("icon"),
    color: text("color")
})

export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id").references(() => categories.id).notNull(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    amount: real("amount").notNull(),
    description: text("description"),
    date: text("date").notNull(),
    createdAt: text("create_at").notNull().$defaultFn(() => new Date().toISOString())
})

export const budgets = sqliteTable("budgets", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categryId: integer("category_id").references(() => categories.id).notNull().unique(),
    monthlyLimit: real("montly_limit").notNull(),
    alertThreshold: real("alert_thresold").default(0.8).notNull()
})
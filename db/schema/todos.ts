import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const projects = sqliteTable("projects", {
    id: integer("id").primaryKey({ autoIncrement: true}),
    name: text("name").notNull(),
    color: text("color").default("#10b981")
})

export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").references(() => projects.id),
    title: text("title").notNull(),
    description: text("description"),
    priority: text("priority", { enum: ["low", "medium", "high", "critical"] }).default("medium").notNull(),
    status: text("status", { enum: ["pending", "in_progress", "done", "cancelled"] }).default("pending").notNull(),
    dueDate: text("due_date"),
    position: integer("position").default(0),
    createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString())
})

export const tags = sqliteTable("tags", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    color: text("color").default("#6b7280")
})

export const todosTags = sqliteTable("todos_tags", {
    todoId: integer("todo_id").references(() => todos.id).notNull(),
    tagId: integer("tag_id").references(() => tags.id).notNull()
})
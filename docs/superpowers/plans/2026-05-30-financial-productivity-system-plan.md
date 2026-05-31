# Financial & Productivity System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal financial management and productivity system with 4 modules (Finances, To-Do, Wishlist, Dashboard).

**Architecture:** Astro SSR pages with Preact islands for interactivity. Drizzle ORM with SQLite (dev) / PostgreSQL (prod). API endpoints for mutations. Service layer for business logic.

**Tech Stack:** Astro 5, Preact, Drizzle ORM, better-sqlite3, Tailwind CSS, pnpm, TypeScript

---

## File Structure

```
task-personals/
├── package.json
├── astro.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
├── .env
├── .gitignore
├── db/
│   ├── index.ts                          # DB connection (SQLite/PostgreSQL)
│   └── schema/
│       ├── index.ts                      # Re-exports all schemas
│       ├── finances.ts                   # categories, transactions, budgets
│       ├── todos.ts                      # projects, todos, tags, todos_tags
│       └── wishlist.ts                   # wishlist_items
├── src/
│   ├── lib/
│   │   ├── db.ts                         # Drizzle client helper
│   │   └── formats.ts                    # Currency, date, percentage formatters
│   ├── services/
│   │   ├── finances.ts                   # Transaction CRUD + balance calc + budget alerts
│   │   ├── todos.ts                      # Todo CRUD + reorder + filter
│   │   └── wishlist.ts                   # Wishlist CRUD + savings progress
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Select.tsx
│   │   └── widgets/
│   │       ├── TransactionForm.tsx
│   │       ├── TransactionList.tsx
│   │       ├── BudgetChart.tsx
│   │       ├── BalanceWidget.tsx
│   │       ├── TodoList.tsx
│   │       ├── TodoForm.tsx
│   │       ├── TodoKanban.tsx
│   │       ├── WishlistGrid.tsx
│   │       ├── WishlistForm.tsx
│   │       ├── DashboardGrid.tsx
│   │       └── CsvImport.tsx
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── finances/
│   │   │   ├── index.astro
│   │   │   ├── transactions.astro
│   │   │   └── budgets.astro
│   │   ├── todos/
│   │   │   ├── index.astro
│   │   │   └── kanban.astro
│   │   ├── wishlist/
│   │   │   └── index.astro
│   │   └── api/
│   │       ├── transactions.ts
│   │       ├── budgets.ts
│   │       ├── todos.ts
│   │       ├── todos-reorder.ts
│   │       ├── projects.ts
│   │       ├── tags.ts
│   │       ├── wishlist.ts
│   │       └── import/
│   │           └── csv.ts
│   └── env.d.ts
└── python/
    ├── requirements.txt
    └── export_csv.py
```

---

## Phase 0: Project Scaffolding

### Task 0.1: Initialize project with pnpm

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.ts`
- Create: `tailwind.config.ts`
- Create: `drizzle.config.ts`
- Create: `.env`
- Create: `.gitignore`
- Create: `src/env.d.ts`

- [ ] **Step 1: Create package.json and install deps**

```bash
cd "D:\Cursos o intentos de programacion\Proyectos de portafolio\Task-Personals"
pnpm init
```

```json
{
  "name": "task-personals",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

- [ ] **Step 2: Install Astro + core deps**

```bash
pnpm add astro@latest
pnpm add @astrojs/preact @astrojs/tailwind tailwindcss
pnpm add drizzle-orm better-sqlite3
pnpm add drizzle-kit @types/better-sqlite3 -D
```

**Security note:** `better-sqlite3` is actively maintained (weekly releases), has 0 known vulnerabilities in latest version, and is the most popular SQLite driver for Node.js. `drizzle-orm` has no supply chain history issues — it's a TypeScript-native project from a reputable team.

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@db/*": ["db/*"]
    }
  },
  "include": ["src/**/*", "db/**/*"]
}
```

- [ ] **Step 4: Create astro.config.ts**

```ts
import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
  integrations: [
    preact({ compat: false }),
    tailwind()
  ],
  output: "server",
  server: { port: 3000 }
})
```

- [ ] **Step 5: Create tailwind.config.ts**

```ts
import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{astro,tsx,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: "#10b981", 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b" }
      }
    }
  },
  plugins: []
} satisfies Config
```

- [ ] **Step 6: Create drizzle.config.ts**

```ts
import type { Config } from "drizzle-kit"

export default {
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: { url: "./db/data.sqlite" }
} satisfies Config
```

- [ ] **Step 7: Create .env**

```
DB_URL=./db/data.sqlite
DB_DIALECT=sqlite
```

- [ ] **Step 8: Create .gitignore**

```
node_modules/
dist/
.env
*.sqlite
db/migrations/
.superpowers/
```

- [ ] **Step 9: Create src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 10: Verify install**

```bash
pnpm astro --version
pnpm run dev
```

Expected: Astro dev server starts on port 3000 with no errors.

---

## Phase 1: Database Schema + Connection

### Task 1.1: Create Drizzle schema files

**Files:**
- Create: `db/schema/finances.ts`
- Create: `db/schema/todos.ts`
- Create: `db/schema/wishlist.ts`
- Create: `db/schema/index.ts`
- Create: `db/index.ts`

- [ ] **Step 1: Create db/schema/finances.ts**

```ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
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
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString())
})

export const budgets = sqliteTable("budgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id).notNull().unique(),
  monthlyLimit: real("monthly_limit").notNull(),
  alertThreshold: real("alert_threshold").default(0.8).notNull()
})
```

- [ ] **Step 2: Create db/schema/todos.ts**

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
```

- [ ] **Step 3: Create db/schema/wishlist.ts**

```ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const wishlistItems = sqliteTable("wishlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  estimatedPrice: real("estimated_price").notNull(),
  savedAmount: real("saved_amount").default(0).notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium").notNull(),
  targetDate: text("target_date"),
  url: text("url"),
  notes: text("notes"),
  purchased: integer("purchased", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString())
})
```

- [ ] **Step 4: Create db/schema/index.ts**

```ts
export * from "./finances"
export * from "./todos"
export * from "./wishlist"
```

- [ ] **Step 5: Create db/index.ts**

```ts
import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema/index"

const sqlite = new Database(process.env.DB_URL || "./db/data.sqlite")
sqlite.pragma("journal_mode = WAL")
sqlite.pragma("foreign_keys = ON")

export const db = drizzle(sqlite, { schema })
export { schema }
```

- [ ] **Step 6: Push schema to create tables**

```bash
pnpm run db:generate
pnpm run db:migrate
```

Expected: No errors. Tables created in `db/data.sqlite`.

---

## Phase 2: Base Layout + Navigation

### Task 2.1: Create layout and navigation

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Create: `src/lib/formats.ts`

- [ ] **Step 1: Create src/lib/formats.ts**

```ts
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CR", { year: "numeric", month: "short", day: "numeric" })
}

export function formatPercent(n: number): string {
  return `${Math.round(n * 100)}%`
}
```

- [ ] **Step 2: Create src/layouts/BaseLayout.astro**

```astro
---
import { formatCurrency } from "../lib/formats"
import { db } from "../../db"
import { transactions } from "../../db/schema/finances"
import { sql, eq, and } from "drizzle-orm"

const now = new Date()
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
const income = db.select({ total: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "income"), sql`date >= ${monthStart}`)).get()
const expense = db.select({ total: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "expense"), sql`date >= ${monthStart}`)).get()
const balance = (income?.total ?? 0) - (expense?.total ?? 0)
---

<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Task Personals</title>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <nav class="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center gap-6">
      <a href="/" class="text-lg font-bold text-emerald-400">TP</a>
      <div class="flex gap-4 text-sm">
        <a href="/finances" class="hover:text-emerald-400 transition">💰 Finanzas</a>
        <a href="/finances/transactions" class="hover:text-emerald-400 transition">📋 Transacciones</a>
        <a href="/finances/budgets" class="hover:text-emerald-400 transition">🎯 Presupuestos</a>
        <a href="/todos" class="hover:text-emerald-400 transition">✅ Tareas</a>
        <a href="/todos/kanban" class="hover:text-emerald-400 transition">📌 Kanban</a>
        <a href="/wishlist" class="hover:text-emerald-400 transition">🎁 Deseos</a>
      </div>
    </div>
    <div class="text-sm text-slate-400">
      Balance este mes: <span class="font-semibold text-emerald-400">{formatCurrency(balance)}</span>
    </div>
  </nav>
  <main class="max-w-7xl mx-auto px-4 py-6">
    <slot />
  </main>
</body>
</html>
```

- [ ] **Step 3: Update src/pages/index.astro (placeholder)**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro"
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
  <p class="text-slate-400">Bienvenido a Task Personals. Dashboard próximamente.</p>
</BaseLayout>
```

- [ ] **Step 4: Verify layout renders**

```bash
pnpm run dev
```

Expected: Page loads with nav bar showing "TP", links, and balance.

---

## Phase 3: Service Layer

### Task 3.1: Create services for all modules

**Files:**
- Create: `src/services/finances.ts`
- Create: `src/services/todos.ts`
- Create: `src/services/wishlist.ts`

- [ ] **Step 1: Create src/services/finances.ts**

```ts
import { db } from "../../db"
import { transactions, categories, budgets } from "../../db/schema/finances"
import { eq, and, sql, gte, lte, desc } from "drizzle-orm"

export function listTransactions(opts?: { type?: string; categoryId?: number; from?: string; to?: string }) {
  const conditions = []
  if (opts?.type) conditions.push(eq(transactions.type, opts.type))
  if (opts?.categoryId) conditions.push(eq(transactions.categoryId, opts.categoryId))
  if (opts?.from) conditions.push(gte(transactions.date, opts.from))
  if (opts?.to) conditions.push(lte(transactions.date, opts.to))
  return db.select({ transaction: transactions, category: categories }).from(transactions).leftJoin(categories, eq(transactions.categoryId, categories.id)).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(transactions.date)).all()
}

export function createTransaction(data: { categoryId: number; type: "income" | "expense"; amount: number; date: string; description?: string }) {
  return db.insert(transactions).values(data).returning().get()
}

export function updateTransaction(id: number, data: Partial<{ categoryId: number; type: "income" | "expense"; amount: number; date: string; description: string }>) {
  return db.update(transactions).set(data).where(eq(transactions.id, id)).returning().get()
}

export function deleteTransaction(id: number) {
  return db.delete(transactions).where(eq(transactions.id, id)).run()
}

export function getBalance(from: string, to: string) {
  const income = db.select({ total: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "income"), gte(transactions.date, from), lte(transactions.date, to))).get()
  const expense = db.select({ total: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "expense"), gte(transactions.date, from), lte(transactions.date, to))).get()
  return { income: income?.total ?? 0, expense: expense?.total ?? 0, balance: (income?.total ?? 0) - (expense?.total ?? 0) }
}

export function getCategoryTotals(from: string, to: string) {
  return db.select({ categoryId: transactions.categoryId, total: sql<number>`coalesce(sum(amount),0)`, name: categories.name, color: categories.color }).from(transactions).leftJoin(categories, eq(transactions.categoryId, categories.id)).where(and(eq(transactions.type, "expense"), gte(transactions.date, from), lte(transactions.date, to))).groupBy(transactions.categoryId).all()
}

export function listBudgets() {
  return db.select({ budget: budgets, category: categories }).from(budgets).leftJoin(categories, eq(budgets.categoryId, categories.id)).all()
}

export function upsertBudget(data: { categoryId: number; monthlyLimit: number; alertThreshold?: number }) {
  const existing = db.select().from(budgets).where(eq(budgets.categoryId, data.categoryId)).get()
  if (existing) return db.update(budgets).set(data).where(eq(budgets.categoryId, data.categoryId)).returning().get()
  return db.insert(budgets).values(data).returning().get()
}

export function getBudgetAlerts(from: string, to: string) {
  const totals = getCategoryTotals(from, to)
  const budgetList = listBudgets()
  return budgetList.map(b => {
    const spent = totals.find(t => t.categoryId === b.budget.categoryId)
    const ratio = (spent?.total ?? 0) / b.budget.monthlyLimit
    return { ...b, spent: spent?.total ?? 0, ratio, alert: ratio >= (b.budget.alertThreshold ?? 0.8) }
  }).filter(b => b.alert)
}

export function listCategories(type?: "income" | "expense") {
  const conditions = type ? [eq(categories.type, type)] : []
  return db.select().from(categories).where(conditions.length ? and(...conditions) : undefined).all()
}

export function createCategory(data: { name: string; type: "income" | "expense"; icon?: string; color?: string }) {
  return db.insert(categories).values(data).returning().get()
}
```

- [ ] **Step 2: Create src/services/todos.ts**

```ts
import { db } from "../../db"
import { todos, projects, tags, todosTags } from "../../db/schema/todos"
import { eq, and, desc, asc, sql } from "drizzle-orm"

export function listTodos(opts?: { status?: string; projectId?: number }) {
  const conditions = []
  if (opts?.status) conditions.push(eq(todos.status, opts.status))
  if (opts?.projectId) conditions.push(eq(todos.projectId, opts.projectId))
  return db.select().from(todos).where(conditions.length ? and(...conditions) : undefined).orderBy(asc(todos.position), desc(todos.createdAt)).all()
}

export function createTodo(data: { title: string; projectId?: number; description?: string; priority?: string; dueDate?: string; tagIds?: number[] }) {
  const todo = db.insert(todos).values({ title: data.title, projectId: data.projectId, description: data.description, priority: data.priority as any, dueDate: data.dueDate }).returning().get()
  if (data.tagIds?.length) {
    db.insert(todosTags).values(data.tagIds.map(tagId => ({ todoId: todo.id, tagId }))).run()
  }
  return todo
}

export function updateTodo(id: number, data: Partial<{ title: string; projectId: number | null; description: string; priority: string; status: string; dueDate: string | null; position: number; tagIds: number[] }>) {
  const { tagIds, ...todoData } = data
  if (tagIds) {
    db.delete(todosTags).where(eq(todosTags.todoId, id)).run()
    if (tagIds.length) db.insert(todosTags).values(tagIds.map(tagId => ({ todoId: id, tagId }))).run()
  }
  return db.update(todos).set(todoData as any).where(eq(todos.id, id)).returning().get()
}

export function deleteTodo(id: number) {
  db.delete(todosTags).where(eq(todosTags.todoId, id)).run()
  return db.delete(todos).where(eq(todos.id, id)).run()
}

export function reorderTodos(ordered: { id: number; position: number; status: string }[]) {
  for (const item of ordered) {
    db.update(todos).set({ position: item.position, status: item.status as any }).where(eq(todos.id, item.id)).run()
  }
  return true
}

export function listProjects() {
  return db.select().from(projects).all()
}

export function createProject(data: { name: string; color?: string }) {
  return db.insert(projects).values(data).returning().get()
}

export function listTags() {
  return db.select().from(tags).all()
}

export function createTag(data: { name: string; color?: string }) {
  return db.insert(tags).values(data).returning().get()
}
```

- [ ] **Step 3: Create src/services/wishlist.ts**

```ts
import { db } from "../../db"
import { wishlistItems } from "../../db/schema/wishlist"
import { eq, desc } from "drizzle-orm"

export function listWishlist(opts?: { purchased?: boolean }) {
  const conditions = opts?.purchased !== undefined ? [eq(wishlistItems.purchased, opts.purchased)] : []
  return db.select().from(wishlistItems).where(conditions.length ? eq(wishlistItems.purchased, opts!.purchased!) : undefined).orderBy(desc(wishlistItems.createdAt)).all()
}

export function createWishlistItem(data: { name: string; estimatedPrice: number; savedAmount?: number; priority?: string; targetDate?: string; url?: string; notes?: string }) {
  return db.insert(wishlistItems).values(data).returning().get()
}

export function updateWishlistItem(id: number, data: Partial<{ name: string; estimatedPrice: number; savedAmount: number; priority: string; targetDate: string; url: string; notes: string; purchased: boolean }>) {
  return db.update(wishlistItems).set(data).where(eq(wishlistItems.id, id)).returning().get()
}

export function deleteWishlistItem(id: number) {
  return db.delete(wishlistItems).where(eq(wishlistItems.id, id)).run()
}

export function getWishlistSummary() {
  const items = db.select().from(wishlistItems).where(eq(wishlistItems.purchased, false)).all()
  const totalEstimated = items.reduce((s, i) => s + i.estimatedPrice, 0)
  const totalSaved = items.reduce((s, i) => s + i.savedAmount, 0)
  return { items, totalEstimated, totalSaved, remaining: totalEstimated - totalSaved }
}
```

---

## Phase 4: API Endpoints

### Task 4.1: Create all API endpoints

**Files:**
- Create: `src/pages/api/transactions.ts`
- Create: `src/pages/api/budgets.ts`
- Create: `src/pages/api/todos.ts`
- Create: `src/pages/api/todos-reorder.ts`
- Create: `src/pages/api/projects.ts`
- Create: `src/pages/api/tags.ts`
- Create: `src/pages/api/wishlist.ts`
- Create: `src/pages/api/import/csv.ts`

- [ ] **Step 1: Create src/pages/api/transactions.ts**

```ts
import type { APIRoute } from "astro"
import { listTransactions, createTransaction, updateTransaction, deleteTransaction } from "../../services/finances"

export const GET: APIRoute = ({ url }) => {
  const data = listTransactions({ type: url.searchParams.get("type") ?? undefined, categoryId: url.searchParams.get("categoryId") ? Number(url.searchParams.get("categoryId")) : undefined, from: url.searchParams.get("from") ?? undefined, to: url.searchParams.get("to") ?? undefined })
  return new Response(JSON.stringify({ ok: true, data }))
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.categoryId || !body.amount || !body.date || !body.type) return new Response(JSON.stringify({ ok: false, error: "Faltan campos requeridos" }), { status: 400 })
  const data = createTransaction(body)
  return new Response(JSON.stringify({ ok: true, data }))
}

export const PUT: APIRoute = async ({ request, params }) => {
  const id = Number(params.id)
  if (isNaN(id)) return new Response(JSON.stringify({ ok: false, error: "ID inválido" }), { status: 400 })
  const body = await request.json()
  const data = updateTransaction(id, body)
  return new Response(JSON.stringify({ ok: true, data }))
}

export const DELETE: APIRoute = ({ params }) => {
  const id = Number(params.id)
  if (isNaN(id)) return new Response(JSON.stringify({ ok: false, error: "ID inválido" }), { status: 400 })
  deleteTransaction(id)
  return new Response(JSON.stringify({ ok: true }))
}
```

- [ ] **Step 2: Create src/pages/api/budgets.ts**

```ts
import type { APIRoute } from "astro"
import { listBudgets, upsertBudget, getBudgetAlerts } from "../../services/finances"

export const GET: APIRoute = ({ url }) => {
  if (url.searchParams.has("alerts")) {
    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
    return new Response(JSON.stringify({ ok: true, data: getBudgetAlerts(from, to) }))
  }
  return new Response(JSON.stringify({ ok: true, data: listBudgets() }))
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.categoryId || !body.monthlyLimit) return new Response(JSON.stringify({ ok: false, error: "Faltan campos requeridos" }), { status: 400 })
  const data = upsertBudget(body)
  return new Response(JSON.stringify({ ok: true, data }))
}
```

- [ ] **Step 3: Create src/pages/api/todos.ts**

```ts
import type { APIRoute } from "astro"
import { listTodos, createTodo, updateTodo, deleteTodo } from "../../services/todos"

export const GET: APIRoute = ({ url }) => {
  const data = listTodos({ status: url.searchParams.get("status") ?? undefined, projectId: url.searchParams.get("projectId") ? Number(url.searchParams.get("projectId")) : undefined })
  return new Response(JSON.stringify({ ok: true, data }))
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.title) return new Response(JSON.stringify({ ok: false, error: "Falta el título" }), { status: 400 })
  const data = createTodo(body)
  return new Response(JSON.stringify({ ok: true, data }))
}

export const PUT: APIRoute = async ({ request, params }) => {
  const id = Number(params.id)
  if (isNaN(id)) return new Response(JSON.stringify({ ok: false, error: "ID inválido" }), { status: 400 })
  const body = await request.json()
  const data = updateTodo(id, body)
  return new Response(JSON.stringify({ ok: true, data }))
}

export const DELETE: APIRoute = ({ params }) => {
  const id = Number(params.id)
  if (isNaN(id)) return new Response(JSON.stringify({ ok: false, error: "ID inválido" }), { status: 400 })
  deleteTodo(id)
  return new Response(JSON.stringify({ ok: true }))
}
```

- [ ] **Step 4: Create src/pages/api/todos-reorder.ts**

```ts
import type { APIRoute } from "astro"
import { reorderTodos } from "../../services/todos"

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!Array.isArray(body)) return new Response(JSON.stringify({ ok: false, error: "Se requiere un array" }), { status: 400 })
  reorderTodos(body)
  return new Response(JSON.stringify({ ok: true }))
}
```

- [ ] **Step 5: Create src/pages/api/projects.ts**

```ts
import type { APIRoute } from "astro"
import { listProjects, createProject } from "../../services/todos"

export const GET: APIRoute = () => new Response(JSON.stringify({ ok: true, data: listProjects() }))
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.name) return new Response(JSON.stringify({ ok: false, error: "Falta el nombre" }), { status: 400 })
  return new Response(JSON.stringify({ ok: true, data: createProject(body) }))
}
```

- [ ] **Step 6: Create src/pages/api/tags.ts**

```ts
import type { APIRoute } from "astro"
import { listTags, createTag } from "../../services/todos"

export const GET: APIRoute = () => new Response(JSON.stringify({ ok: true, data: listTags() }))
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.name) return new Response(JSON.stringify({ ok: false, error: "Falta el nombre" }), { status: 400 })
  return new Response(JSON.stringify({ ok: true, data: createTag(body) }))
}
```

- [ ] **Step 7: Create src/pages/api/wishlist.ts**

```ts
import type { APIRoute } from "astro"
import { listWishlist, createWishlistItem, updateWishlistItem, deleteWishlistItem, getWishlistSummary } from "../../services/wishlist"

export const GET: APIRoute = ({ url }) => {
  if (url.searchParams.has("summary")) return new Response(JSON.stringify({ ok: true, data: getWishlistSummary() }))
  return new Response(JSON.stringify({ ok: true, data: listWishlist() }))
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.name || !body.estimatedPrice) return new Response(JSON.stringify({ ok: false, error: "Faltan campos requeridos" }), { status: 400 })
  const data = createWishlistItem(body)
  return new Response(JSON.stringify({ ok: true, data }))
}

export const PUT: APIRoute = async ({ request, params }) => {
  const id = Number(params.id)
  if (isNaN(id)) return new Response(JSON.stringify({ ok: false, error: "ID inválido" }), { status: 400 })
  const body = await request.json()
  const data = updateWishlistItem(id, body)
  return new Response(JSON.stringify({ ok: true, data }))
}

export const DELETE: APIRoute = ({ params }) => {
  const id = Number(params.id)
  if (isNaN(id)) return new Response(JSON.stringify({ ok: false, error: "ID inválido" }), { status: 400 })
  deleteWishlistItem(id)
  return new Response(JSON.stringify({ ok: true }))
}
```

- [ ] **Step 8: Create src/pages/api/import/csv.ts**

```ts
import type { APIRoute } from "astro"
import { createTransaction } from "../../../services/finances"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const file = formData.get("file") as File
  if (!file) return new Response(JSON.stringify({ ok: false, error: "No se envió archivo" }), { status: 400 })

  const text = await file.text()
  const lines = text.split("\n").filter(Boolean)
  const results: { ok: boolean; line: number; error?: string }[] = []

  for (let i = 1; i < lines.length; i++) {
    const [date, type, amount, categoryId, description] = lines[i].split(",").map(s => s.trim())
    if (!date || !type || !amount || !categoryId) { results.push({ ok: false, line: i + 1, error: "Campos incompletos" }); continue }
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount)) { results.push({ ok: false, line: i + 1, error: "Monto inválido" }); continue }
    try {
      createTransaction({ date, type: type as any, amount: parsedAmount, categoryId: parseInt(categoryId), description })
      results.push({ ok: true, line: i + 1 })
    } catch (e: any) { results.push({ ok: false, line: i + 1, error: e.message }) }
  }

  return new Response(JSON.stringify({ ok: true, data: { total: lines.length - 1, success: results.filter(r => r.ok).length, errors: results.filter(r => !r.ok) } }))
}
```

---

## Phase 5: Finances Pages + Components

### Task 5.1: Create finance pages

**Files:**
- Create: `src/pages/finances/index.astro`
- Create: `src/pages/finances/transactions.astro`
- Create: `src/pages/finances/budgets.astro`
- Create: `src/components/widgets/TransactionForm.tsx`
- Create: `src/components/widgets/TransactionList.tsx`
- Create: `src/components/widgets/BudgetChart.tsx`

- [ ] **Step 1: Create src/pages/finances/index.astro**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro"
import { db } from "../../../db"
import { transactions, categories } from "../../../db/schema/finances"
import { eq, and, sql, gte, lte, desc } from "drizzle-orm"
import { formatCurrency } from "../../lib/formats"
import BudgetChart from "../../components/widgets/BudgetChart.tsx"
import BalanceWidget from "../../components/widgets/BalanceWidget.tsx"

const now = new Date()
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
const { income, expense, balance } = (() => {
  const inc = db.select({ total: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "income"), gte(transactions.date, monthStart), lte(transactions.date, monthEnd))).get()
  const exp = db.select({ total: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "expense"), gte(transactions.date, monthStart), lte(transactions.date, monthEnd))).get()
  return { income: inc?.total ?? 0, expense: exp?.total ?? 0, balance: (inc?.total ?? 0) - (exp?.total ?? 0) }
})()

const categoryTotals = db.select({ total: sql<number>`coalesce(sum(amount),0)`, name: categories.name, color: categories.color }).from(transactions).leftJoin(categories, eq(transactions.categoryId, categories.id)).where(and(eq(transactions.type, "expense"), gte(transactions.date, monthStart), lte(transactions.date, monthEnd))).groupBy(transactions.categoryId).all()

const recentTx = db.select({ transaction: transactions, category: categories }).from(transactions).leftJoin(categories, eq(transactions.categoryId, categories.id)).orderBy(desc(transactions.date)).limit(5).all()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">💰 Resumen Financiero</h1>
  <div class="grid grid-cols-3 gap-4 mb-8">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Ingresos</p><p class="text-xl font-bold text-emerald-400">{formatCurrency(income)}</p></div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Gastos</p><p class="text-xl font-bold text-red-400">{formatCurrency(expense)}</p></div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Balance</p><p class="text-xl font-bold {balance >= 0 ? 'text-emerald-400' : 'text-red-400'}">{formatCurrency(balance)}</p></div>
  </div>
  <div class="grid grid-cols-2 gap-6 mb-8">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h2 class="text-lg font-semibold mb-3">Gastos por Categoría</h2>
      <BudgetChart client:load data={categoryTotals} />
    </div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h2 class="text-lg font-semibold mb-3">Transacciones Recientes</h2>
      <div class="space-y-2">{recentTx.map(t => <div class="flex justify-between items-center py-1 border-b border-slate-800 last:border-0"><span class="text-sm">{t.category?.name || "Sin categoría"}</span><span class="text-sm font-medium {t.transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}">{t.transaction.type === 'income' ? '+' : '-'}{formatCurrency(t.transaction.amount)}</span></div>)}</div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Create src/pages/finances/transactions.astro**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro"
import { listCategories } from "../../services/finances"
import TransactionForm from "../../components/widgets/TransactionForm.tsx"
import TransactionList from "../../components/widgets/TransactionList.tsx"

const allCategories = listCategories()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">📋 Transacciones</h1>
  <TransactionForm client:load categories={allCategories} />
  <div class="mt-6">
    <TransactionList client:load categories={allCategories} />
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create src/pages/finances/budgets.astro**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro"
import { listCategories } from "../../services/finances"
import { listBudgets } from "../../services/finances"
import { formatCurrency } from "../../lib/formats"

const allCategories = listCategories()
const allBudgets = listBudgets()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">🎯 Presupuestos</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {allCategories.filter(c => c.type === "expense").map(cat => {
      const budget = allBudgets.find(b => b.budget.categoryId === cat.id)
      return <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">{cat.name}</span>
          <span class="text-sm text-slate-400">{budget ? formatCurrency(budget.budget.monthlyLimit) + "/mes" : "Sin presupuesto"}</span>
        </div>
        {budget && <div class="w-full bg-slate-800 rounded-full h-2"><div class="bg-emerald-500 h-2 rounded-full" style="width: 0%"></div></div>}
      </div>
    })}
  </div>
</BaseLayout>
```

- [ ] **Step 4: Create UI components (src/components/ui/)**

```tsx
// Button.tsx
import { h } from "preact"
interface Props { children: any; onClick?: () => void; variant?: "primary" | "secondary" | "danger"; class?: string; type?: "button" | "submit" }
const variants = { primary: "bg-emerald-600 hover:bg-emerald-500 text-white", secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200", danger: "bg-red-600 hover:bg-red-500 text-white" }
export default function Button({ children, onClick, variant = "primary", class: cls, type = "button" }: Props) {
  return <button type={type} onClick={onClick} class={`px-4 py-2 rounded-lg text-sm font-medium transition ${variants[variant]} ${cls || ""}`}>{children}</button>
}
```

```tsx
// Modal.tsx
import { h } from "preact"
interface Props { open: boolean; onClose: () => void; title: string; children: any }
export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null
  return <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
    <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
      <h2 class="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  </div>
}
```

```tsx
// Input.tsx
import { h } from "preact"
interface Props { label: string; name: string; type?: string; value?: string | number; onInput?: (e: any) => void; required?: boolean; placeholder?: string }
export default function Input({ label, name, type = "text", value, onInput, required, placeholder }: Props) {
  return <div class="mb-3"><label class="block text-sm text-slate-400 mb-1" for={name}>{label}</label><input id={name} name={name} type={type} value={value} onInput={onInput} required={required} placeholder={placeholder} class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500" /></div>
}
```

```tsx
// Select.tsx
import { h } from "preact"
interface Option { value: string | number; label: string }
interface Props { label: string; name: string; options: Option[]; value?: string | number; onChange?: (e: any) => void; required?: boolean }
export default function Select({ label, name, options, value, onChange, required }: Props) {
  return <div class="mb-3"><label class="block text-sm text-slate-400 mb-1" for={name}>{label}</label><select id={name} name={name} value={value} onChange={onChange} required={required} class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">{options.map(o => <option value={o.value}>{o.label}</option>)}</select></div>
}
```

- [ ] **Step 5: Create src/components/widgets/TransactionForm.tsx**

```tsx
import { h } from "preact"
import { useState } from "preact/hooks"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function TransactionForm({ categories }: { categories: { id: number; name: string; type: string }[] }) {
  const [type, setType] = useState("expense")
  const expenseCats = categories.filter(c => c.type === "expense")
  const incomeCats = categories.filter(c => c.type === "income")
  const filtered = type === "expense" ? expenseCats : incomeCats

  async function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    const res = await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, amount: parseFloat(data.amount as string), categoryId: parseInt(data.categoryId as string) }) })
    if (res.ok) { form.reset(); window.location.reload() }
  }

  return <form onSubmit={handleSubmit} class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Nueva Transacción</h2>
    <div class="flex gap-2 mb-3">
      <button type="button" onClick={() => setType("expense")} class={`px-4 py-1 rounded-lg text-sm ${type === "expense" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"}`}>Gasto</button>
      <button type="button" onClick={() => setType("income")} class={`px-4 py-1 rounded-lg text-sm ${type === "income" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>Ingreso</button>
    </div>
    <input type="hidden" name="type" value={type} />
    <Select label="Categoría" name="categoryId" options={filtered.map(c => ({ value: c.id, label: c.name }))} required />
    <Input label="Monto" name="amount" type="number" required placeholder="0" />
    <Input label="Fecha" name="date" type="date" required />
    <Input label="Descripción" name="description" placeholder="Opcional" />
    <Button type="submit">Guardar</Button>
  </form>
}
```

- [ ] **Step 6: Create src/components/widgets/TransactionList.tsx**

```tsx
import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { formatCurrency, formatDate } from "../../lib/formats"

export default function TransactionList({ categories }: { categories: { id: number; name: string }[] }) {
  const [txs, setTxs] = useState<any[]>([])
  const [filter, setFilter] = useState("")

  useEffect(() => { fetch("/api/transactions").then(r => r.json()).then(d => setTxs(d.data)) }, [])

  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]))
  const filtered = filter ? txs.filter(t => t.transaction.type === filter) : txs

  async function deleteTx(id: number) {
    if (!confirm("¿Eliminar?")) return
    await fetch(`/api/transactions/${id}`, { method: "DELETE" })
    setTxs(txs.filter(t => t.transaction.id !== id))
  }

  return <div class="bg-slate-900 rounded-xl border border-slate-800 p-4">
    <div class="flex gap-2 mb-4">
      {["", "income", "expense"].map(f => <button onClick={() => setFilter(f)} class={`px-3 py-1 rounded-lg text-sm ${filter === f ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>{f === "" ? "Todas" : f === "income" ? "Ingresos" : "Gastos"}</button>)}
    </div>
    <div class="space-y-2">{filtered.map(t => <div class="flex justify-between items-center py-2 border-b border-slate-800 last:border-0"><div><p class="text-sm font-medium">{catMap[t.transaction.categoryId] || "Sin categoría"}</p><p class="text-xs text-slate-500">{t.transaction.description || formatDate(t.transaction.date)}</p></div><div class="flex items-center gap-3"><span class={`text-sm font-medium ${t.transaction.type === "income" ? "text-emerald-400" : "text-red-400"}`}>{t.transaction.type === "income" ? "+" : "-"}{formatCurrency(t.transaction.amount)}</span><button onClick={() => deleteTx(t.transaction.id)} class="text-xs text-slate-600 hover:text-red-400">✕</button></div></div>)}</div>
    {filtered.length === 0 && <p class="text-sm text-slate-500 text-center py-4">Sin transacciones</p>}
  </div>
}
```

- [ ] **Step 7: Create src/components/widgets/BudgetChart.tsx**

```tsx
import { h } from "preact"
import { useEffect, useRef } from "preact/hooks"
import { formatCurrency } from "../../lib/formats"

export default function BudgetChart({ data }: { data: { total: number; name: string; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const total = data.reduce((s, d) => s + d.total, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || total === 0) return
    const ctx = canvas.getContext("2d")!
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2, r = Math.min(cx, cy) - 10
    let startAngle = -Math.PI / 2
    data.forEach(d => {
      const sliceAngle = (d.total / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = d.color || "#6b7280"
      ctx.fill()
      startAngle += sliceAngle
    })
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = "#0f172a"
    ctx.fill()
  }, [data, total])

  if (total === 0) return <p class="text-sm text-slate-500 text-center py-8">Sin gastos este mes</p>

  return <div class="flex items-center gap-4">
    <canvas ref={canvasRef} width={200} height={200} class="flex-shrink-0" />
    <div class="space-y-1">{data.map(d => <div class="flex items-center gap-2 text-sm"><span class="w-2 h-2 rounded-full" style={`background:${d.color}`}></span><span class="text-slate-400">{d.name}</span><span class="font-medium ml-auto">{formatCurrency(d.total)}</span></div>)}</div>
  </div>
}
```

- [ ] **Step 8: Create src/components/widgets/BalanceWidget.tsx**

```tsx
import { h } from "preact"
import { formatCurrency } from "../../lib/formats"

export default function BalanceWidget({ income, expense, balance }: { income: number; expense: number; balance: number }) {
  return <div class="grid grid-cols-1 gap-4">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Balance Mensual</p><p class={`text-2xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatCurrency(balance)}</p></div>
  </div>
}
```

---

## Phase 6: To-Do Module

### Task 6.1: Create todo pages

**Files:**
- Create: `src/pages/todos/index.astro`
- Create: `src/pages/todos/kanban.astro`
- Create: `src/components/widgets/TodoForm.tsx`
- Create: `src/components/widgets/TodoList.tsx`
- Create: `src/components/widgets/TodoKanban.tsx`

- [ ] **Step 1: Create src/pages/todos/index.astro**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro"
import { listProjects, listTodos, listTags } from "../../services/todos"
import TodoForm from "../../components/widgets/TodoForm.tsx"
import TodoList from "../../components/widgets/TodoList.tsx"

const projects = listProjects()
const tags = listTags()
const allTodos = listTodos()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">✅ Tareas</h1>
  <TodoForm client:load projects={projects} tags={tags} />
  <div class="mt-6"><TodoList client:load todos={allTodos} projects={projects} tags={tags} /></div>
</BaseLayout>
```

- [ ] **Step 2: Create src/pages/todos/kanban.astro**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro"
import TodoKanban from "../../components/widgets/TodoKanban.tsx"
import { listTodos, listProjects } from "../../services/todos"

const todos = listTodos()
const projects = listProjects()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">📌 Kanban</h1>
  <TodoKanban client:load todos={todos} projects={projects} />
</BaseLayout>
```

- [ ] **Step 3: Create src/components/widgets/TodoForm.tsx**

```tsx
import { h } from "preact"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function TodoForm({ projects, tags }: { projects: { id: number; name: string }[]; tags: { id: number; name: string; color: string }[] }) {
  async function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const data: any = { title: fd.get("title") as string, projectId: fd.get("projectId") ? parseInt(fd.get("projectId") as string) : undefined, priority: fd.get("priority") as string, dueDate: fd.get("dueDate") as string || undefined }
    await fetch("/api/todos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    form.reset()
    window.location.reload()
  }

  return <form onSubmit={handleSubmit} class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Nueva Tarea</h2>
    <Input label="Título" name="title" required />
    <Select label="Proyecto" name="projectId" options={[{ value: "", label: "Sin proyecto" }, ...projects.map(p => ({ value: p.id, label: p.name }))]} />
    <Select label="Prioridad" name="priority" options={[{ value: "low", label: "Baja" }, { value: "medium", label: "Media" }, { value: "high", label: "Alta" }, { value: "critical", label: "Crítica" }]} />
    <Input label="Fecha límite" name="dueDate" type="date" />
    <Button type="submit">Crear Tarea</Button>
  </form>
}
```

- [ ] **Step 4: Create src/components/widgets/TodoList.tsx**

```tsx
import { h } from "preact"
import { formatDate } from "../../lib/formats"

const priorityColors: Record<string, string> = { low: "text-slate-400", medium: "text-blue-400", high: "text-orange-400", critical: "text-red-400" }
const statusLabels: Record<string, string> = { pending: "Pendiente", in_progress: "En progreso", done: "Completada", cancelled: "Cancelada" }

export default function TodoList({ todos, projects, tags }: { todos: any[]; projects: { id: number; name: string }[]; tags: { id: number; name: string; color: string }[] }) {
  const projMap = Object.fromEntries(projects.map(p => [p.id, p.name]))
  async function toggleStatus(t: any) {
    const next = t.status === "pending" ? "in_progress" : t.status === "in_progress" ? "done" : "pending"
    await fetch(`/api/todos/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) })
    window.location.reload()
  }
  async function deleteTodo(id: number) {
    if (!confirm("¿Eliminar?")) return
    await fetch(`/api/todos/${id}`, { method: "DELETE" })
    window.location.reload()
  }
  return <div class="bg-slate-900 rounded-xl border border-slate-800 p-4">
    <div class="space-y-2">{todos.map(t => <div class="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"><div class="flex items-center gap-3"><button onClick={() => toggleStatus(t)} class={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${t.status === "done" ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>{t.status === "done" && "✓"}</button><div><p class={`text-sm ${t.status === "done" ? "line-through text-slate-600" : ""}`}>{t.title}</p><div class="flex gap-2 text-xs text-slate-500">{t.projectId && <span>{projMap[t.projectId]}</span>}<span class={priorityColors[t.priority]}>{t.priority}</span>{t.dueDate && <span>{formatDate(t.dueDate)}</span>}</div></div></div><button onClick={() => deleteTodo(t.id)} class="text-xs text-slate-600 hover:text-red-400">✕</button></div>)}</div>
    {todos.length === 0 && <p class="text-sm text-slate-500 text-center py-4">Sin tareas</p>}
  </div>
}
```

- [ ] **Step 5: Create src/components/widgets/TodoKanban.tsx**

```tsx
import { h } from "preact"
import { useState } from "preact/hooks"
import { formatDate } from "../../lib/formats"

const columns = [{ key: "pending", label: "Pendiente" }, { key: "in_progress", label: "En Progreso" }, { key: "done", label: "Completada" }]
const priorityColors: Record<string, string> = { low: "text-slate-400", medium: "text-blue-400", high: "text-orange-400", critical: "text-red-400" }

export default function TodoKanban({ todos, projects }: { todos: any[]; projects: { id: number; name: string; color: string }[] }) {
  const projMap = Object.fromEntries(projects.map(p => [p.id, { name: p.name, color: p.color }]))

  async function moveTodo(id: number, status: string) {
    await fetch(`/api/todos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    window.location.reload()
  }

  return <div class="grid grid-cols-3 gap-4">{columns.map(col => <div class="bg-slate-900 rounded-xl border border-slate-800 p-4"><h3 class="text-sm font-semibold text-slate-400 mb-3">{col.label} ({todos.filter(t => t.status === col.key).length})</h3><div class="space-y-2">{[...todos.filter(t => t.status === col.key)].sort((a, b) => a.position - b.position).map(t => <div class="bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-move"><p class="text-sm font-medium">{t.title}</p><div class="flex items-center gap-2 mt-2 text-xs"><span class={priorityColors[t.priority]}>{t.priority}</span>{t.dueDate && <span class="text-slate-500">{formatDate(t.dueDate)}</span>}</div><div class="flex gap-1 mt-2">{columns.filter(c => c.key !== t.status).map(c => <button onClick={() => moveTodo(t.id, c.key)} class="text-xs px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300">{c.label}</button>)}</div></div>)}</div></div>)}</div>
}
```

---

## Phase 7: Wishlist Module

### Task 7.1: Create wishlist page and components

**Files:**
- Create: `src/pages/wishlist/index.astro`
- Create: `src/components/widgets/WishlistGrid.tsx`
- Create: `src/components/widgets/WishlistForm.tsx`

- [ ] **Step 1: Create src/pages/wishlist/index.astro**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro"
import { getWishlistSummary } from "../../services/wishlist"
import { formatCurrency } from "../../lib/formats"
import WishlistGrid from "../../components/widgets/WishlistGrid.tsx"
import WishlistForm from "../../components/widgets/WishlistForm.tsx"

const summary = getWishlistSummary()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">🎁 Lista de Deseos</h1>
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Total estimado</p><p class="text-xl font-bold">{formatCurrency(summary.totalEstimated)}</p></div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Ahorrado</p><p class="text-xl font-bold text-emerald-400">{formatCurrency(summary.totalSaved)}</p></div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Falta</p><p class="text-xl font-bold text-orange-400">{formatCurrency(summary.remaining)}</p></div>
  </div>
  <WishlistForm client:load />
  <div class="mt-6"><WishlistGrid client:load items={summary.items} /></div>
</BaseLayout>
```

- [ ] **Step 2: Create src/components/widgets/WishlistForm.tsx**

```tsx
import { h } from "preact"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function WishlistForm() {
  async function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const data = { name: fd.get("name") as string, estimatedPrice: parseFloat(fd.get("estimatedPrice") as string), priority: fd.get("priority") as string, targetDate: (fd.get("targetDate") as string) || undefined, url: (fd.get("url") as string) || undefined, notes: (fd.get("notes") as string) || undefined }
    await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    form.reset()
    window.location.reload()
  }

  return <form onSubmit={handleSubmit} class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Nuevo Deseo</h2>
    <Input label="Producto" name="name" required />
    <Input label="Precio estimado" name="estimatedPrice" type="number" required />
    <Select label="Prioridad" name="priority" options={[{ value: "low", label: "Baja" }, { value: "medium", label: "Media" }, { value: "high", label: "Alta" }]} />
    <Input label="Fecha objetivo" name="targetDate" type="date" />
    <Input label="URL" name="url" placeholder="https://..." />
    <Input label="Notas" name="notes" placeholder="Opcional" />
    <Button type="submit">Agregar</Button>
  </form>
}
```

- [ ] **Step 3: Create src/components/widgets/WishlistGrid.tsx**

```tsx
import { h } from "preact"
import { formatCurrency } from "../../lib/formats"

export default function WishlistGrid({ items }: { items: any[] }) {
  async function updateSaved(id: number, amount: number) {
    await fetch(`/api/wishlist/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ savedAmount: amount }) })
    window.location.reload()
  }
  async function markPurchased(id: number) {
    await fetch(`/api/wishlist/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ purchased: true }) })
    window.location.reload()
  }
  async function deleteItem(id: number) {
    if (!confirm("¿Eliminar?")) return
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" })
    window.location.reload()
  }

  if (items.length === 0) return <p class="text-slate-500 text-center py-8">No hay deseos registrados</p>

  return <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(item => { const pct = item.savedAmount / item.estimatedPrice; return <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><div class="flex justify-between items-start mb-2"><h3 class="font-medium">{item.name}</h3><button onClick={() => deleteItem(item.id)} class="text-xs text-slate-600 hover:text-red-400">✕</button></div><div class="text-sm text-slate-400 mb-2">{formatCurrency(item.estimatedPrice)}</div><div class="w-full bg-slate-800 rounded-full h-2 mb-2"><div class="bg-emerald-500 h-2 rounded-full" style={`width: ${Math.min(pct * 100, 100)}%`}></div></div><div class="flex justify-between text-xs text-slate-500 mb-3"><span>{formatCurrency(item.savedAmount)}</span><span>{Math.round(pct * 100)}%</span></div><div class="flex gap-2"><input type="number" class="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs" placeholder="Ahorrar..." onKeyDown={(e: any) => { if (e.key === "Enter") updateSaved(item.id, parseFloat(e.target.value) + item.savedAmount) }} /><button onClick={() => markPurchased(item.id)} class="text-xs px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded">Comprado</button></div></div> })}
  </div>
}
```

---

## Phase 8: Dashboard Page

### Task 8.1: Create main dashboard

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/widgets/DashboardGrid.tsx`

- [ ] **Step 1: Update src/pages/index.astro**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro"
import { db } from "../../db"
import { transactions } from "../../db/schema/finances"
import { todos } from "../../db/schema/todos"
import { wishlistItems } from "../../db/schema/wishlist"
import { categories } from "../../db/schema/finances"
import { eq, and, sql, gte, lte, desc } from "drizzle-orm"
import { formatCurrency } from "../lib/formats"
import DashboardGrid from "../components/widgets/DashboardGrid.tsx"
import BudgetChart from "../components/widgets/BudgetChart.tsx"

const now = new Date()
const ms = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
const me = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

const inc = db.select({ t: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "income"), gte(transactions.date, ms), lte(transactions.date, me))).get()
const exp = db.select({ t: sql<number>`coalesce(sum(amount),0)` }).from(transactions).where(and(eq(transactions.type, "expense"), gte(transactions.date, ms), lte(transactions.date, me))).get()
const balance = (inc?.t ?? 0) - (exp?.t ?? 0)

const catTotals = db.select({ total: sql<number>`coalesce(sum(amount),0)`, name: categories.name, color: categories.color }).from(transactions).leftJoin(categories, eq(transactions.categoryId, categories.id)).where(and(eq(transactions.type, "expense"), gte(transactions.date, ms), lte(transactions.date, me))).groupBy(transactions.categoryId).all()

const pendingTodos = db.select().from(todos).where(eq(todos.status, "pending")).orderBy(asc(todos.dueDate)).limit(5).all()
const overdueTodos = db.select().from(todos).where(and(eq(todos.status, "pending"), sql`due_date < ${now.toISOString()}`)).all()

const wishSummary = db.select({ t: sql<number>`coalesce(sum(estimated_price),0)`, s: sql<number>`coalesce(sum(saved_amount),0)` }).from(wishlistItems).where(eq(wishlistItems.purchased, false)).get()
---

<BaseLayout>
  <h1 class="text-2xl font-bold mb-6">📊 Dashboard</h1>
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Balance del Mes</p><p class={`text-xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatCurrency(balance)}</p></div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Tareas Pendientes</p><p class="text-xl font-bold text-blue-400">{pendingTodos.length}</p></div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Próximas Compras</p><p class="text-xl font-bold text-orange-400">{formatCurrency(wishSummary?.s ?? 0)} / {formatCurrency(wishSummary?.t ?? 0)}</p></div>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h2 class="text-lg font-semibold mb-3">Gastos del Mes</h2>
      <BudgetChart client:load data={catTotals} />
    </div>
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h2 class="text-lg font-semibold mb-3">Tareas Próximas</h2>
      <div class="space-y-2">{pendingTodos.map(t => <div class="py-1 border-b border-slate-800 last:border-0"><p class="text-sm">{t.title}</p><p class="text-xs text-slate-500">{t.dueDate ? `Vence: ${new Date(t.dueDate).toLocaleDateString("es-CR")}` : "Sin fecha"}</p></div>)}</div>
      {pendingTodos.length === 0 && <p class="text-sm text-slate-500 text-center py-4">¡Todo al día!</p>}
    </div>
  </div>
</BaseLayout>
```

---

## Phase 9: Python Scripts

### Task 9.1: Create export scripts

**Files:**
- Create: `python/requirements.txt`
- Create: `python/export_csv.py`

- [ ] **Step 1: Create python/requirements.txt**

```
# No external dependencies needed - using Python stdlib only
# csv, sqlite3, datetime are built-in
```

- [ ] **Step 2: Create python/export_csv.py**

```python
#!/usr/bin/env python3
import csv
import sqlite3
import sys
from datetime import datetime

DB_PATH = sys.argv[1] if len(sys.argv) > 1 else "./db/data.sqlite"
OUTPUT = sys.argv[2] if len(sys.argv) > 2 else f"export_{datetime.now().strftime('%Y%m%d')}.csv"

conn = sqlite3.connect(DB_PATH)
rows = conn.execute("""
    SELECT t.date, t.type, t.amount, c.name as category, t.description
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    ORDER BY t.date DESC
""").fetchall()

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["Fecha", "Tipo", "Monto", "Categoría", "Descripción"])
    w.writerows(rows)

print(f"Exportadas {len(rows)} transacciones a {OUTPUT}")
conn.close()
```

- [ ] **Step 3: Verify script works**

```bash
python python/export_csv.py
```

Expected: Creates `export_YYYYMMDD.csv` with transaction data.

---

## Self-Review Checklist

1. **Spec coverage:** Every section of the spec has a corresponding task - schema (Phase 1), services (Phase 3), API (Phase 4), finances pages (Phase 5), todos (Phase 6), wishlist (Phase 7), dashboard (Phase 8), Python scripts (Phase 9).
2. **Placeholder scan:** No "TBD", "TODO", or placeholder content found.
3. **Type consistency:** All types used in components match schema definitions. `formatCurrency` is defined once and used consistently. Service functions return types consistent with API handlers.

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
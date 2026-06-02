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

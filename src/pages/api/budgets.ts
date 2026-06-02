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

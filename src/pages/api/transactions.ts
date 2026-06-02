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

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

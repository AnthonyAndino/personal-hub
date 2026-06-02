import type { APIRoute } from "astro"
import { reorderTodos } from "../../services/todos"

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!Array.isArray(body)) return new Response(JSON.stringify({ ok: false, error: "Se requiere un array" }), { status: 400 })
  reorderTodos(body)
  return new Response(JSON.stringify({ ok: true }))
}

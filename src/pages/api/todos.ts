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

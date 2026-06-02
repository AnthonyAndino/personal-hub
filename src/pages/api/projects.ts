import type { APIRoute } from "astro"
import { listProjects, createProject } from "../../services/todos"

export const GET: APIRoute = () => new Response(JSON.stringify({ ok: true, data: listProjects() }))
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  if (!body.name) return new Response(JSON.stringify({ ok: false, error: "Falta el nombre" }), { status: 400 })
  return new Response(JSON.stringify({ ok: true, data: createProject(body) }))
}

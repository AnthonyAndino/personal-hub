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

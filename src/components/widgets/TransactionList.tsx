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

import { h } from "preact"
import { formatCurrency } from "../../lib/formats"

export default function WishlistGrid({ items }: { items: any[] }) {
  async function updateSaved(id: number, amount: number) {
    await fetch(`/api/wishlist/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ savedAmount: amount }) })
    window.location.reload()
  }
  async function markPurchased(id: number) {
    await fetch(`/api/wishlist/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ purchased: true }) })
    window.location.reload()
  }
  async function deleteItem(id: number) {
    if (!confirm("¿Eliminar?")) return
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" })
    window.location.reload()
  }

  if (items.length === 0) return <p class="text-slate-500 text-center py-8">No hay deseos registrados</p>

  return <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(item => { const pct = item.savedAmount / item.estimatedPrice; return <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><div class="flex justify-between items-start mb-2"><h3 class="font-medium">{item.name}</h3><button onClick={() => deleteItem(item.id)} class="text-xs text-slate-600 hover:text-red-400">✕</button></div><div class="text-sm text-slate-400 mb-2">{formatCurrency(item.estimatedPrice)}</div><div class="w-full bg-slate-800 rounded-full h-2 mb-2"><div class="bg-emerald-500 h-2 rounded-full" style={`width: ${Math.min(pct * 100, 100)}%`}></div></div><div class="flex justify-between text-xs text-slate-500 mb-3"><span>{formatCurrency(item.savedAmount)}</span><span>{Math.round(pct * 100)}%</span></div><div class="flex gap-2"><input type="number" class="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs" placeholder="Ahorrar..." onKeyDown={(e: any) => { if (e.key === "Enter") updateSaved(item.id, parseFloat(e.target.value) + item.savedAmount) }} /><button onClick={() => markPurchased(item.id)} class="text-xs px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded">Comprado</button></div></div> })}
  </div>
}

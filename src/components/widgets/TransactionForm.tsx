import { h } from "preact"
import { useState } from "preact/hooks"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function TransactionForm({ categories }: { categories: { id: number; name: string; type: string }[] }) {
  const [type, setType] = useState("expense")
  const expenseCats = categories.filter(c => c.type === "expense")
  const incomeCats = categories.filter(c => c.type === "income")
  const filtered = type === "expense" ? expenseCats : incomeCats

  async function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    const res = await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, amount: parseFloat(data.amount as string), categoryId: parseInt(data.categoryId as string) }) })
    if (res.ok) { form.reset(); window.location.reload() }
  }

  return <form onSubmit={handleSubmit} class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Nueva Transacción</h2>
    <div class="flex gap-2 mb-3">
      <button type="button" onClick={() => setType("expense")} class={`px-4 py-1 rounded-lg text-sm ${type === "expense" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"}`}>Gasto</button>
      <button type="button" onClick={() => setType("income")} class={`px-4 py-1 rounded-lg text-sm ${type === "income" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>Ingreso</button>
    </div>
    <input type="hidden" name="type" value={type} />
    <Select label="Categoría" name="categoryId" options={filtered.map(c => ({ value: c.id, label: c.name }))} required />
    <Input label="Monto" name="amount" type="number" required placeholder="0" />
    <Input label="Fecha" name="date" type="date" required />
    <Input label="Descripción" name="description" placeholder="Opcional" />
    <Button type="submit">Guardar</Button>
  </form>
}

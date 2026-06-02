import { h } from "preact"
import { formatDate } from "../../lib/formats"

const priorityColors: Record<string, string> = { low: "text-slate-400", medium: "text-blue-400", high: "text-orange-400", critical: "text-red-400" }

export default function TodoList({ todos, projects }: { todos: any[]; projects: { id: number; name: string }[] }) {
  const projMap = Object.fromEntries(projects.map(p => [p.id, p.name]))
  async function toggleStatus(t: any) {
    const next = t.status === "pending" ? "in_progress" : t.status === "in_progress" ? "done" : "pending"
    await fetch(`/api/todos/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) })
    window.location.reload()
  }
  async function deleteTodo(id: number) {
    if (!confirm("¿Eliminar?")) return
    await fetch(`/api/todos/${id}`, { method: "DELETE" })
    window.location.reload()
  }
  return <div class="bg-slate-900 rounded-xl border border-slate-800 p-4">
    <div class="space-y-2">{todos.map(t => <div class="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"><div class="flex items-center gap-3"><button onClick={() => toggleStatus(t)} class={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${t.status === "done" ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>{t.status === "done" && "✓"}</button><div><p class={`text-sm ${t.status === "done" ? "line-through text-slate-600" : ""}`}>{t.title}</p><div class="flex gap-2 text-xs text-slate-500">{t.projectId && <span>{projMap[t.projectId]}</span>}<span class={priorityColors[t.priority]}>{t.priority}</span>{t.dueDate && <span>{formatDate(t.dueDate)}</span>}</div></div></div><button onClick={() => deleteTodo(t.id)} class="text-xs text-slate-600 hover:text-red-400">✕</button></div>)}</div>
    {todos.length === 0 && <p class="text-sm text-slate-500 text-center py-4">Sin tareas</p>}
  </div>
}

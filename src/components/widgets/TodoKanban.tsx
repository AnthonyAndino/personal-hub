import { h } from "preact"
import { formatDate } from "../../lib/formats"

const columns = [{ key: "pending", label: "Pendiente" }, { key: "in_progress", label: "En Progreso" }, { key: "done", label: "Completada" }]
const priorityColors: Record<string, string> = { low: "text-slate-400", medium: "text-blue-400", high: "text-orange-400", critical: "text-red-400" }

export default function TodoKanban({ todos, projects }: { todos: any[]; projects: { id: number; name: string; color: string }[] }) {
  async function moveTodo(id: number, status: string) {
    await fetch(`/api/todos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    window.location.reload()
  }

  return <div class="grid grid-cols-3 gap-4">{columns.map(col => <div class="bg-slate-900 rounded-xl border border-slate-800 p-4"><h3 class="text-sm font-semibold text-slate-400 mb-3">{col.label} ({todos.filter(t => t.status === col.key).length})</h3><div class="space-y-2">{[...todos.filter(t => t.status === col.key)].sort((a, b) => a.position - b.position).map(t => <div class="bg-slate-800 p-3 rounded-lg border border-slate-700"><p class="text-sm font-medium">{t.title}</p><div class="flex items-center gap-2 mt-2 text-xs"><span class={priorityColors[t.priority]}>{t.priority}</span>{t.dueDate && <span class="text-slate-500">{formatDate(t.dueDate)}</span>}</div><div class="flex gap-1 mt-2">{columns.filter(c => c.key !== t.status).map(c => <button onClick={() => moveTodo(t.id, c.key)} class="text-xs px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300">{c.label}</button>)}</div></div>)}</div></div>)}</div>
}

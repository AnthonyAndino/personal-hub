import { h } from "preact"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function TodoForm({ projects, tags }: { projects: { id: number; name: string }[]; tags: { id: number; name: string; color: string }[] }) {
  async function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const data: any = { title: fd.get("title") as string, projectId: fd.get("projectId") ? parseInt(fd.get("projectId") as string) : undefined, priority: fd.get("priority") as string, dueDate: fd.get("dueDate") as string || undefined }
    await fetch("/api/todos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    form.reset()
    window.location.reload()
  }

  return <form onSubmit={handleSubmit} class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Nueva Tarea</h2>
    <Input label="Título" name="title" required />
    <Select label="Proyecto" name="projectId" options={[{ value: "", label: "Sin proyecto" }, ...projects.map(p => ({ value: p.id, label: p.name }))]} />
    <Select label="Prioridad" name="priority" options={[{ value: "low", label: "Baja" }, { value: "medium", label: "Media" }, { value: "high", label: "Alta" }, { value: "critical", label: "Crítica" }]} />
    <Input label="Fecha límite" name="dueDate" type="date" />
    <Button type="submit">Crear Tarea</Button>
  </form>
}

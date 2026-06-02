import { h } from "preact"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function WishlistForm() {
  async function handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const data = { name: fd.get("name") as string, estimatedPrice: parseFloat(fd.get("estimatedPrice") as string), priority: fd.get("priority") as string, targetDate: (fd.get("targetDate") as string) || undefined, url: (fd.get("url") as string) || undefined, notes: (fd.get("notes") as string) || undefined }
    await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    form.reset()
    window.location.reload()
  }

  return <form onSubmit={handleSubmit} class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Nuevo Deseo</h2>
    <Input label="Producto" name="name" required />
    <Input label="Precio estimado" name="estimatedPrice" type="number" required />
    <Select label="Prioridad" name="priority" options={[{ value: "low", label: "Baja" }, { value: "medium", label: "Media" }, { value: "high", label: "Alta" }]} />
    <Input label="Fecha objetivo" name="targetDate" type="date" />
    <Input label="URL" name="url" placeholder="https://..." />
    <Input label="Notas" name="notes" placeholder="Opcional" />
    <Button type="submit">Agregar</Button>
  </form>
}

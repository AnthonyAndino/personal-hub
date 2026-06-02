import { h } from "preact"
import { useState } from "preact/hooks"
import Button from "../ui/Button"

export default function CsvImport() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(e: Event) {
    e.preventDefault()
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/import/csv", { method: "POST", body: formData })
    const data = await res.json()
    setResult(data.data)
  }

  return <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
    <h2 class="text-lg font-semibold mb-3">Importar CSV</h2>
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".csv" onChange={(e: any) => setFile(e.target.files[0])} class="mb-3 text-sm" />
      <Button type="submit">Importar</Button>
    </form>
    {result && <div class="mt-3 text-sm"><p>Total: {result.total} | Éxitos: {result.success} | Errores: {result.errors.length}</p></div>}
  </div>
}

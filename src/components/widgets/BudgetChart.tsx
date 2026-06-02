import { h } from "preact"
import { useEffect, useRef } from "preact/hooks"
import { formatCurrency } from "../../lib/formats"

export default function BudgetChart({ data }: { data: { total: number; name: string; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const total = data.reduce((s, d) => s + d.total, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || total === 0) return
    const ctx = canvas.getContext("2d")!
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2, r = Math.min(cx, cy) - 10
    let startAngle = -Math.PI / 2
    data.forEach(d => {
      const sliceAngle = (d.total / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = d.color || "#6b7280"
      ctx.fill()
      startAngle += sliceAngle
    })
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = "#0f172a"
    ctx.fill()
  }, [data, total])

  if (total === 0) return <p class="text-sm text-slate-500 text-center py-8">Sin gastos este mes</p>

  return <div class="flex items-center gap-4">
    <canvas ref={canvasRef} width={200} height={200} class="flex-shrink-0" />
    <div class="space-y-1">{data.map(d => <div class="flex items-center gap-2 text-sm"><span class="w-2 h-2 rounded-full" style={`background:${d.color}`}></span><span class="text-slate-400">{d.name}</span><span class="font-medium ml-auto">{formatCurrency(d.total)}</span></div>)}</div>
  </div>
}

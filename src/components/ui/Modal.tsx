import { h } from "preact"
interface Props { open: boolean; onClose: () => void; title: string; children: any }
export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null
  return <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
    <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
      <h2 class="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  </div>
}

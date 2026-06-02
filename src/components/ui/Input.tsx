import { h } from "preact"
interface Props { label: string; name: string; type?: string; value?: string | number; onInput?: (e: any) => void; required?: boolean; placeholder?: string }
export default function Input({ label, name, type = "text", value, onInput, required, placeholder }: Props) {
  return <div class="mb-3"><label class="block text-sm text-slate-400 mb-1" for={name}>{label}</label><input id={name} name={name} type={type} value={value} onInput={onInput} required={required} placeholder={placeholder} class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500" /></div>
}

import { h } from "preact"
interface Option { value: string | number; label: string }
interface Props { label: string; name: string; options: Option[]; value?: string | number; onChange?: (e: any) => void; required?: boolean }
export default function Select({ label, name, options, value, onChange, required }: Props) {
  return <div class="mb-3"><label class="block text-sm text-slate-400 mb-1" for={name}>{label}</label><select id={name} name={name} value={value} onChange={onChange} required={required} class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">{options.map(o => <option value={o.value}>{o.label}</option>)}</select></div>
}

import { h } from "preact"
interface Props { children: any; onClick?: () => void; variant?: "primary" | "secondary" | "danger"; class?: string; type?: "button" | "submit" }
const variants = { primary: "bg-emerald-600 hover:bg-emerald-500 text-white", secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200", danger: "bg-red-600 hover:bg-red-500 text-white" }
export default function Button({ children, onClick, variant = "primary", class: cls, type = "button" }: Props) {
  return <button type={type} onClick={onClick} class={`px-4 py-2 rounded-lg text-sm font-medium transition ${variants[variant]} ${cls || ""}`}>{children}</button>
}

import { h } from "preact"
import { formatCurrency } from "../../lib/formats"

export default function BalanceWidget({ income, expense, balance }: { income: number; expense: number; balance: number }) {
  return <div class="grid grid-cols-1 gap-4">
    <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><p class="text-sm text-slate-400">Balance Mensual</p><p class={`text-2xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatCurrency(balance)}</p></div>
  </div>
}

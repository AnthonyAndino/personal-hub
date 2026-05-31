export function formatCurrency(n: number): string {
    return new Intl.NumberFormat("es-HN", { style: "currency", currency: "CRC", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("es-HN", { year: "numeric", month: "short", day: "numeric"})
}

export function formatPercent(n: number): string {
    return `${Math.round(n * 100)}%`
}
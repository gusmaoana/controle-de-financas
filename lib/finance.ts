export type TransactionType = "income" | "expense"

export type Transaction = {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: string
  date: string // ISO date (yyyy-mm-dd)
}

export const CATEGORIES: Record<TransactionType, string[]> = {
  income: ["Salário", "Freelance", "Investimentos", "Presente", "Outros"],
  expense: [
    "Moradia",
    "Alimentação",
    "Transporte",
    "Lazer",
    "Saúde",
    "Educação",
    "Compras",
    "Contas",
    "Outros",
  ],
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function todayISO(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export function summarize(transactions: Transaction[]) {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === "income") income += t.amount
    else expense += t.amount
  }
  return { income, expense, balance: income - expense }
}

export function monthBounds(isoDate: string) {
  const [year, month] = isoDate.split("-").map(Number)
  const start = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  return { start, end }
}

export function dayLabel(isoDate: string) {
  const [year, month, day] = isoDate.split("-")
  return `Dia ${day}/${month}/${year}`
}

export function monthTitle(year: number, month: number) {
  const name = new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
  })
  return `Mês ${name}/${year}`
}

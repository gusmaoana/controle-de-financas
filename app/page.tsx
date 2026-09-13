"use client"

import { useMemo } from "react"
import { Wallet } from "lucide-react"
import { SummaryCards } from "@/components/summary-cards"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { useTransactions } from "@/hooks/use-transactions"
import { summarize } from "@/lib/finance"

export default function Page() {
  const { transactions, addTransaction, removeTransaction, loaded } = useTransactions()
  const { income, expense, balance } = useMemo(() => summarize(transactions), [transactions])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold leading-tight">Controle de Finanças Pessoais</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas receitas e despesas em um só lugar
            </p>
          </div>
        </header>

        <SummaryCards income={income} expense={expense} balance={balance} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <TransactionForm onAdd={addTransaction} />
          {loaded ? (
            <TransactionList transactions={transactions} onRemove={removeTransaction} />
          ) : (
            <div className="rounded-xl border border-border" />
          )}
        </div>
      </div>
    </main>
  )
}

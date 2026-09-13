"use client"

import { useCallback, useEffect, useState } from "react"
import type { Transaction } from "@/lib/finance"

const STORAGE_KEY = "cfp:transactions"

const SEED: Transaction[] = [
  {
    id: "seed-1",
    description: "Salário mensal",
    amount: 5200,
    type: "income",
    category: "Salário",
    date: new Date().toISOString().slice(0, 8) + "05",
  },
  {
    id: "seed-2",
    description: "Aluguel",
    amount: 1800,
    type: "expense",
    category: "Moradia",
    date: new Date().toISOString().slice(0, 8) + "06",
  },
  {
    id: "seed-3",
    description: "Supermercado",
    amount: 640,
    type: "expense",
    category: "Alimentação",
    date: new Date().toISOString().slice(0, 8) + "10",
  },
]

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setTransactions(JSON.parse(raw))
      } else {
        setTransactions(SEED)
      }
    } catch {
      setTransactions(SEED)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch {
      // ignore write errors
    }
  }, [transactions, loaded])

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...t, id: crypto.randomUUID() },
      ...prev,
    ])
  }, [])

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { transactions, addTransaction, removeTransaction, loaded }
}

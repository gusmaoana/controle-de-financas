"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES, todayISO, type Transaction, type TransactionType } from "@/lib/finance"

type Props = {
  onAdd: (t: Omit<Transaction, "id">) => void
}

export function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState(CATEGORIES.expense[0])
  const [date, setDate] = useState(todayISO())

  function handleTypeChange(next: TransactionType) {
    setType(next)
    setCategory(CATEGORIES[next][0])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number.parseFloat(amount.replace(",", "."))
    if (!description.trim() || !Number.isFinite(parsed) || parsed <= 0) return

    onAdd({
      description: description.trim(),
      amount: parsed,
      type,
      category,
      date,
    })

    setDescription("")
    setAmount("")
    setDate(todayISO())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nova transação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => handleTypeChange("expense")}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              onClick={() => handleTypeChange("income")}
            >
              Receita
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex.: Mercado, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[type].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="size-4" />
            Adicionar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

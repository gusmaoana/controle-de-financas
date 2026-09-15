"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import {
  dayLabel,
  formatCurrency,
  monthBounds,
  monthTitle,
  todayISO,
} from "@/lib/finance"
import { DayPieChart } from "@/components/day-pie-chart"
import { MonthComboChart } from "@/components/month-combo-chart"
import { cn } from "@/lib/utils"

type Row = { valor: number | string; data: string }

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value)
}

export function DashboardPanel() {
  const [date, setDate] = useState(todayISO)
  const [receitas, setReceitas] = useState<Row[]>([])
  const [despesas, setDespesas] = useState<Row[]>([])

  const year = Number(date.slice(0, 4))
  const month = Number(date.slice(5, 7))

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from("receitas").select("valor, data"),
      supabase.from("despesas").select("valor, data"),
    ]).then(([incomeRes, expenseRes]) => {
      setReceitas((incomeRes.data as Row[]) ?? [])
      setDespesas((expenseRes.data as Row[]) ?? [])
    })
  }, [])

  const dayTotals = useMemo(() => {
    const income = receitas.filter((r) => r.data === date).reduce((s, r) => s + toNumber(r.valor), 0)
    const expense = despesas.filter((r) => r.data === date).reduce((s, r) => s + toNumber(r.valor), 0)
    return { income, expense, balance: income - expense }
  }, [receitas, despesas, date])

  const monthTotals = useMemo(() => {
    const { start, end } = monthBounds(date)
    const income = receitas
      .filter((r) => r.data >= start && r.data <= end)
      .reduce((s, r) => s + toNumber(r.valor), 0)
    const expense = despesas
      .filter((r) => r.data >= start && r.data <= end)
      .reduce((s, r) => s + toNumber(r.valor), 0)
    return { income, expense, balance: income - expense }
  }, [receitas, despesas, date])

  const monthDaily = useMemo(() => {
    const { start, end } = monthBounds(date)
    const lastDay = Number(end.slice(8, 10))
    const prefix = start.slice(0, 8)
    return Array.from({ length: lastDay }, (_, index) => {
      const day = String(index + 1).padStart(2, "0")
      const iso = `${prefix}${day}`
      return {
        dia: String(index + 1),
        receita: receitas
          .filter((row) => row.data === iso)
          .reduce((sum, row) => sum + toNumber(row.valor), 0),
        despesa: despesas
          .filter((row) => row.data === iso)
          .reduce((sum, row) => sum + toNumber(row.valor), 0),
      }
    })
  }, [receitas, despesas, date])

  function setMonth(nextMonth: number) {
    const last = new Date(year, nextMonth, 0).getDate()
    const day = Math.min(Number(date.slice(8, 10)), last)
    setDate(`${year}-${String(nextMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
  }

  function setYear(nextYear: number) {
    const last = new Date(nextYear, month, 0).getDate()
    const day = Math.min(Number(date.slice(8, 10)), last)
    setDate(`${nextYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="grid gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="visao-dia">Visão do dia</Label>
          <Input
            id="visao-dia"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value || todayISO())}
          />
        </div>
        <PeriodCard title={dayLabel(date)} {...dayTotals} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pizza do dia</CardTitle>
          </CardHeader>
          <CardContent>
            <DayPieChart income={dayTotals.income} expense={dayTotals.expense} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="mes">Mês</Label>
            <Input
              id="mes"
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value >= 1 && value <= 12) setMonth(value)
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ano">Ano</Label>
            <Input
              id="ano"
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value >= 2000) setYear(value)
              }}
            />
          </div>
        </div>
        <PeriodCard title={monthTitle(year, month)} {...monthTotals} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita e despesa do mês</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthComboChart data={monthDaily} />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function PeriodCard({
  title,
  income,
  expense,
  balance,
}: {
  title: string
  income: number
  expense: number
  balance: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <Row label="Receitas" value={income} className="text-emerald-600" />
        <Row label="Despesas" value={expense} className="text-destructive" />
        <Row
          label="Saldo"
          value={balance}
          className={cn("font-semibold", balance < 0 ? "text-destructive" : "text-emerald-600")}
        />
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  className,
}: {
  label: string
  value: number
  className?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", className)}>{formatCurrency(value)}</span>
    </div>
  )
}

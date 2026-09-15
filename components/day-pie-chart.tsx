"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/finance"

const COLORS = {
  Receitas: "#059669",
  Despesas: "#dc2626",
}

type Props = {
  income: number
  expense: number
}

export function DayPieChart({ income, expense }: Props) {
  const data = [
    { name: "Receitas", value: income },
    { name: "Despesas", value: expense },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <p className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        Sem lançamentos neste dia para montar a pizza.
      </p>
    )
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={88}
            paddingAngle={2}
          >
            {data.map((item) => (
              <Cell key={item.name} fill={COLORS[item.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

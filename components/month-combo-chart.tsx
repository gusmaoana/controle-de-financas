"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatCurrency } from "@/lib/finance"

type Point = {
  dia: string
  receita: number
  despesa: number
}

type Props = {
  data: Point[]
}

export function MonthComboChart({ data }: Props) {
  const hasValues = data.some((item) => item.receita > 0 || item.despesa > 0)

  if (!hasValues) {
    return (
      <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        Sem lançamentos neste mês para montar o gráfico.
      </p>
    )
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `${Math.round(Number(value))}`} />
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          <Legend />
          <Bar dataKey="receita" name="Receita" fill="#059669" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="despesa"
            name="Despesa"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

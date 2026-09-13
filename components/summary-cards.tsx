import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/finance"
import { cn } from "@/lib/utils"

type Props = {
  income: number
  expense: number
  balance: number
}

export function SummaryCards({ income, expense, balance }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo atual</CardTitle>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wallet className="size-4" />
          </span>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "text-2xl font-semibold tabular-nums",
              balance < 0 ? "text-destructive" : "text-foreground",
            )}
          >
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <ArrowUpRight className="size-4" />
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums text-emerald-500">
            {formatCurrency(income)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <span className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ArrowDownRight className="size-4" />
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums text-destructive">
            {formatCurrency(expense)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

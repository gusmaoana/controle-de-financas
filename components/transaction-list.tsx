"use client"

import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate, type Transaction } from "@/lib/finance"
import { cn } from "@/lib/utils"

type Props = {
  transactions: Transaction[]
  onRemove: (id: string) => void
}

export function TransactionList({ transactions, onRemove }: Props) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Transações{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({transactions.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma transação registrada ainda.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {sorted.map((t) => {
              const isIncome = t.type === "income"
              return (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      isIncome
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="size-4" />
                    ) : (
                      <ArrowDownRight className="size-4" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.category} &middot; {formatDate(t.date)}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 font-semibold tabular-nums",
                      isIncome ? "text-emerald-500" : "text-destructive",
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(t.id)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remover transação</span>
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

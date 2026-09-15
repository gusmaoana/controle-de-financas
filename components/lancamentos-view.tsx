"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate, todayISO } from "@/lib/finance"
import { cn } from "@/lib/utils"
import type { Categoria, Lancamento } from "@/types/database"

type TableName = "receitas" | "despesas"

type Row = Lancamento & { categorias?: { nome: string } | null }

type Props = {
  table: TableName
  title: string
  subtitle: string
  addLabel: string
  emptyLabel: string
  valueClassName: string
}

export function LancamentosView({
  table,
  title,
  subtitle,
  addLabel,
  emptyLabel,
  valueClassName,
}: Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [data, setData] = useState(todayISO())
  const [categoriaId, setCategoriaId] = useState("")

  async function loadAll() {
    const supabase = createClient()
    const [lancamentosRes, categoriasRes] = await Promise.all([
      supabase
        .from(table)
        .select("id, user_id, descricao, valor, data, categoria_id, created_at, categorias(nome)")
        .order("data", { ascending: false }),
      supabase.from("categorias").select("id, user_id, nome, descricao, created_at").order("nome"),
    ])

    if (lancamentosRes.error) {
      setError(lancamentosRes.error.message)
    } else {
      setRows((lancamentosRes.data as Row[]) ?? [])
    }

    const cats = (categoriasRes.data as Categoria[]) ?? []
    setCategorias(cats)
    setCategoriaId((current) => current || cats[0]?.id || "")
    setLoaded(true)
  }

  useEffect(() => {
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const parsed = Number.parseFloat(valor.replace(",", "."))
    if (!descricao.trim() || !Number.isFinite(parsed) || parsed <= 0 || !categoriaId || !data) {
      setError("Preencha descrição, valor maior que zero, data e categoria.")
      return
    }

    setSaving(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Sessão expirada. Entre de novo.")
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from(table).insert({
      user_id: user.id,
      descricao: descricao.trim(),
      valor: parsed,
      data,
      categoria_id: categoriaId,
    })

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setDescricao("")
    setValor("")
    setData(todayISO())
    await loadAll()
  }

  async function onRemove(id: string) {
    const supabase = createClient()
    const { error: deleteError } = await supabase.from(table).delete().eq("id", id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setRows((current) => current.filter((row) => row.id !== id))
  }

  return (
    <main className="px-6 py-8 lg:px-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{addLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`${table}-descricao`}>Descrição</Label>
                <Input
                  id={`${table}-descricao`}
                  placeholder={table === "receitas" ? "Ex.: Salário" : "Ex.: Mercado"}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${table}-valor`}>Valor (R$)</Label>
                <Input
                  id={`${table}-valor`}
                  inputMode="decimal"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${table}-categoria`}>Categoria</Label>
                {categorias.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
                ) : (
                  <div
                    id={`${table}-categoria`}
                    className="max-h-48 overflow-y-auto rounded-lg border border-input bg-background p-1"
                    role="listbox"
                    aria-label="Categoria"
                  >
                    {categorias.map((categoria) => {
                      const selected = categoria.id === categoriaId
                      return (
                        <button
                          key={categoria.id}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => setCategoriaId(categoria.id)}
                          className={cn(
                            "flex w-full rounded-md px-2.5 py-1.5 text-left text-sm text-foreground",
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted",
                          )}
                        >
                          {categoria.nome}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${table}-data`}>Data</Label>
                <Input
                  id={`${table}-data`}
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="h-10 w-full" disabled={saving || categorias.length === 0}>
                <Plus className="size-4" />
                {saving ? "Salvando…" : "Adicionar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <section>
          {!loaded ? (
            <div className="h-32 rounded-xl border border-border" />
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            <div className="grid gap-3">
              {rows.map((row) => (
                <Card key={row.id}>
                  <CardContent className="flex items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{row.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(row.data)}
                        {row.categorias?.nome ? ` · ${row.categorias.nome}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={cn("tabular-nums", valueClassName)}>
                        {formatCurrency(Number(row.valor))}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Excluir"
                        onClick={() => void onRemove(row.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

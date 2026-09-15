"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Categoria } from "@/types/database"

export default function CategoriasPage() {
  const [rows, setRows] = useState<Categoria[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("categorias")
      .select("id, user_id, nome, descricao, created_at")
      .order("nome")
      .then(({ data, error: queryError }) => {
        if (queryError) {
          setError(queryError.message)
        } else {
          setRows((data as Categoria[]) ?? [])
        }
        setLoaded(true)
      })
  }, [])

  return (
    <main className="px-6 py-8 lg:px-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Categorias do usuário logado (seed do SQL)
        </p>
      </header>
      {!loaded ? (
        <div className="h-32 rounded-xl border border-border" />
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada para este usuário.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="py-4">
                <p className="font-medium">{row.nome}</p>
                {row.descricao ? (
                  <p className="text-sm text-muted-foreground">{row.descricao}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

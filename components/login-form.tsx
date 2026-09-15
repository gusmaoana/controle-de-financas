"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("usuario@teste.com")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError("E-mail ou senha incorretos. Use usuario@teste.com e senha 1234.")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Não foi possível entrar. Confira o .env.local e tente de novo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wallet className="size-5" />
        </div>
        <CardTitle className="text-xl">Controle de Finanças</CardTitle>
        <CardDescription>Entre com e-mail e senha para acessar o app.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="lg" className="h-10 w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Usuário de teste: <span className="font-medium text-foreground">usuario@teste.com</span> /{" "}
            <span className="font-medium text-foreground">1234</span>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

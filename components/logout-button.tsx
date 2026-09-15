"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()

  async function onClick() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={onClick}>
      <LogOut className="size-4" />
      Sair
    </Button>
  )
}

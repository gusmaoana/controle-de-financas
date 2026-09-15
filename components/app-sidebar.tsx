"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowUpRight, ArrowDownRight, Tags, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/logout-button"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/receitas", label: "Receitas", icon: ArrowUpRight },
  { href: "/despesas", label: "Despesas", icon: ArrowDownRight },
  { href: "/categorias", label: "Categorias", icon: Tags },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-4" />
        </span>
        <span className="font-semibold">Finanças</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <LogoutButton />
      </div>
    </aside>
  )
}

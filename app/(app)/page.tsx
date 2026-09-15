import { DashboardPanel } from "@/components/dashboard-panel"

export default function DashboardPage() {
  return (
    <main className="px-6 py-8 lg:px-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumo das suas finanças por dia e por mês
        </p>
      </header>
      <DashboardPanel />
    </main>
  )
}

import { AppSidebar } from "@/components/app-sidebar"

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

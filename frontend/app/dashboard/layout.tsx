import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { AuthGuardWrapper } from "@/components/auth-guard-wrapper"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuardWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 space-y-4 p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuardWrapper>
  )
}

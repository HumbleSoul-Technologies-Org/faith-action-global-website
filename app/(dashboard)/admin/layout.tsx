import { AdminProvider } from '@/lib/admin-context'
import AdminSidebar from '@/components/admin-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import AuthGuard from '@/components/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AdminProvider>
        <div className="flex h-screen bg-background">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            {/* Dashboard header visible only on medium+ screens */}
              <div className="hidden md:block">
                <DashboardHeader />
              </div>
            <div className=" md:p-8">
              

              {children}
            </div>
          </main>
        </div>
      </AdminProvider>
    </AuthGuard>
  )
}

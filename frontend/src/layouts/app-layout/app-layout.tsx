import { Navigate, Outlet, useMatches } from "react-router"

import { useSession } from "core/hooks/query/use-query-auth"
import { PATHS } from "router/paths"
import { Separator } from "shared/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "shared/components/ui/sidebar"

import { AppSidebar } from "./app-sidebar"
import { NoticesBell } from "./notices-bell"

/** Lo que cada ruta declara en su `handle` para que el header muestre su título. */
interface RouteHandle {
  title?: string
  description?: string
}

export default function AppLayout() {
  const matches = useMatches()
  const handle = matches.findLast((match) => match.handle)?.handle as RouteHandle | undefined
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) return null

  if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} replace />

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center gap-3 border-b px-4 py-3 md:px-7 md:py-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          {handle?.title && (
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-primary md:text-2xl">{handle.title}</h1>
              {handle.description && (
                <p className="hidden text-sm text-muted-foreground md:block">{handle.description}</p>
              )}
            </div>
          )}
          <div className="ml-auto">
            <NoticesBell />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-7">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

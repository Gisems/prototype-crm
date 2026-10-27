import { Navigate, Outlet } from "react-router"

import { useSession } from "core/hooks/query/use-query-auth"
import { PATHS } from "router/paths"

export default function AppAuth() {
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) return null

  if (isAuthenticated) return <Navigate to={PATHS.DASHBOARD.INDEX} replace />

  return (
    <div className="flex min-h-svh items-center justify-center bg-[image:var(--gradient-hero)] p-5">
      <div className="w-full max-w-100 rounded-lg bg-card p-8 shadow-[var(--shadow-hero)]">
        <Outlet />
      </div>
    </div>
  )
}

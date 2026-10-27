import { Navigate } from "react-router"

import { PATHS } from "router/paths"

export default function DashboardIndex() {
  return <Navigate to={PATHS.DASHBOARD.SALES} replace />
}

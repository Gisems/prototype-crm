import { Outlet } from "react-router"

import { DashboardTabs } from "../sections/dashboard/dashboard-tabs"

export const handle = {
  title: "Dashboard",
  description: "Resumen de tu actividad",
}

// Cada pestaña es una ruta hija que carga sus propios datos.
export default function DashboardLayout() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTabs />
      <Outlet />
    </div>
  )
}

import { Outlet } from "react-router"

export default function AppLayout() {
  return (
    <main className="min-h-svh p-6">
      <Outlet />
    </main>
  )
}

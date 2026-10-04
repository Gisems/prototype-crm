import { Outlet } from "react-router"

export default function AppAuth() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}

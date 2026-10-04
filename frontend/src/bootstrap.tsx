import { Outlet } from "react-router"
import { Toaster } from "sonner"

import { StateProvider } from "core/providers/state-provider"

export default function BootstrapApp() {
  return (
    <StateProvider>
      <Outlet />
      <Toaster expand richColors theme="light" closeButton />
    </StateProvider>
  )
}

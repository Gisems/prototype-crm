import { NuqsAdapter } from "nuqs/adapters/react-router/v8"
import { Outlet } from "react-router"

import { StateProvider } from "core/providers/state-provider"
import { Toaster } from "shared/components/ui/sonner"
import { TooltipProvider } from "shared/components/ui/tooltip"

export default function BootstrapApp() {
  return (
    <StateProvider>
      <NuqsAdapter>
        <TooltipProvider>
          <Outlet />
          <Toaster expand richColors theme="light" closeButton />
        </TooltipProvider>
      </NuqsAdapter>
    </StateProvider>
  )
}

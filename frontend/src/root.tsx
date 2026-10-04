import { isRouteErrorResponse, Links, Meta, Scripts, ScrollRestoration } from "react-router"

import "shared/styles/globals.css"
import type { Route } from "./+types/root"
import BootstrapApp from "./bootstrap"

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>ChatG2I</title>
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
  )
}

export function HydrateFallback() {
  return <div className="flex min-h-screen w-full items-center justify-center">Cargando…</div>
}

export default function App() {
  return <BootstrapApp />
}

export function ErrorBoundary({ error }: Readonly<Route.ErrorBoundaryProps>) {
  let message = "Oops!"
  let details = "Ocurrió un error inesperado, intenta recargar la página."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details = error.status === 404 ? "La página que buscas no existe o ha sido eliminada." : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl rounded-lg p-8">
        <h1 className="mb-4 text-center text-5xl font-bold">Ups! {message}</h1>
        <p className="mb-6 text-center text-lg text-muted-foreground">{details}</p>
        {stack && (
          <div className="overflow-x-auto rounded-lg p-4">
            <pre>
              <code>{stack}</code>
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}

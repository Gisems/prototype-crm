import { LogOut } from "lucide-react"

import { Button } from "shared/components/ui/button"

export function SessionCard({ onSignOut }: Readonly<{ onSignOut: () => void }>) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-bold">Sesión</h2>
        <p className="text-sm text-muted-foreground">Cierra tu sesión en este dispositivo.</p>
      </div>
      <Button type="button" variant="outline" className="text-destructive hover:text-destructive" onClick={onSignOut}>
        <LogOut /> Cerrar sesión
      </Button>
    </section>
  )
}

import { NavLink } from "react-router"

interface RouteTabsProps {
  /** Para el lector de pantalla: qué agrupan estas pestañas. */
  label: string
  tabs: readonly { label: string; to: string }[]
}

/** Pestañas que son rutas: la activa sale de la URL, así que recargar o compartir el enlace conserva la pestaña. */
export function RouteTabs({ label, tabs }: Readonly<RouteTabsProps>) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

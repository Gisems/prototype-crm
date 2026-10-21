import type { LucideIcon } from "lucide-react"

export type MenuItem = {
  label: string
  icon: LucideIcon
  href: string
  /** Sin ruta todavía: se muestra deshabilitado para que el menú ya refleje el prototipo completo. */
  soon?: boolean
}

export type MenuGroup = {
  label: string
  items: MenuItem[]
}

import {
  Bot,
  CalendarDays,
  ChartColumn,
  CircleHelp,
  Columns3,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  Tag,
  Users,
  Zap,
} from "lucide-react"

import type { MenuGroup } from "shared/types/menu"

import { PATHS } from "./paths"

// Los ítems sin `soon` tienen ruta en routes.ts. Principal, Automatización y Negocio siguen al prototipo; el grupo
// Administración es el de quien es dueño o admin de la cuenta: cuando exista el manejo de roles, se oculta a los demás.
export const menu: MenuGroup[] = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: PATHS.DASHBOARD.INDEX },
      { label: "Inbox", icon: Inbox, href: PATHS.INBOX, soon: true },
      { label: "Etapas de venta", icon: Columns3, href: PATHS.PIPELINE, soon: true },
      { label: "Contactos", icon: Users, href: PATHS.CONTACTS.INDEX },
      { label: "Calendario", icon: CalendarDays, href: PATHS.CALENDAR },
    ],
  },
  {
    label: "Automatización",
    items: [
      { label: "Bots & Flujos", icon: Bot, href: PATHS.BOTS, soon: true },
      { label: "Plantillas Meta", icon: FileText, href: PATHS.TEMPLATES, soon: true },
      { label: "Campañas", icon: Megaphone, href: PATHS.CAMPAIGNS, soon: true },
      { label: "Respuestas rápidas", icon: Zap, href: PATHS.QUICK_REPLIES, soon: true },
    ],
  },
  {
    label: "Negocio",
    items: [
      { label: "Catálogo", icon: Tag, href: PATHS.CATALOG.INDEX },
      { label: "Pedidos", icon: Package, href: PATHS.ORDERS, soon: true },
      { label: "Reportes", icon: ChartColumn, href: PATHS.REPORTS, soon: true },
    ],
  },
  {
    label: "Administración",
    items: [
      { label: "Configuración", icon: Settings, href: PATHS.SETTINGS.INDEX },
      { label: "Plan y facturación", icon: CreditCard, href: PATHS.BILLING },
      { label: "Ayuda y soporte", icon: CircleHelp, href: PATHS.HELP },
    ],
  },
]

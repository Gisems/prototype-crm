import { Bot, ChartColumn, CreditCard, Plug, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { FaqTopic } from "core/models/support"
import { PATHS } from "router/paths"

interface FaqTopicInfo {
  icon: LucideIcon
  /** A dónde lleva una pregunta de este tema; sin enlace si esa sección todavía no existe. */
  link?: { label: string; to: string }
}

export const FAQ_TOPICS: Record<FaqTopic, FaqTopicInfo> = {
  channels: { icon: Plug, link: { label: "Ir a Canales & Bots", to: PATHS.SETTINGS.CHANNELS } },
  plan: {
    icon: CreditCard,
    link: { label: "Ir a Plan y facturación", to: PATHS.BILLING },
  },
  team: { icon: Users, link: { label: "Ir a Equipo", to: PATHS.SETTINGS.TEAM } },
  bots: { icon: Bot, link: { label: "Ir a Grupos y Horarios", to: PATHS.SETTINGS.GROUPS } },
  reports: { icon: ChartColumn },
}

import { formatNumber } from "shared/utils/number"

import type { Plan } from "./response"

/** Porcentaje usado, acotado a 0–100 para pintar la barra aunque el uso supere lo incluido. */
export function usagePercent(used: number, included: number) {
  if (included <= 0) return 100

  return Math.min(100, Math.round((used / included) * 100))
}

/** Desde este porcentaje la barra se marca como casi llena. */
export const HIGH_USAGE_PERCENT = 90

/** Lo que se está usando ahora: los mensajes del mes y los miembros del equipo. */
export interface CurrentUsage {
  messagesUsed: number
  seatsUsed: number
}

/** Lo que el uso actual ya excede de `plan`: se muestra antes de cambiar a un plan más chico. */
export function overLimitWarnings(plan: Plan, usage: CurrentUsage) {
  const warnings: string[] = []

  if (usage.seatsUsed > plan.seatsIncluded) {
    warnings.push(`Tu equipo tiene ${usage.seatsUsed} miembros y ${plan.name} incluye ${plan.seatsIncluded}.`)
  }

  if (usage.messagesUsed > plan.messagesIncluded) {
    warnings.push(
      `Ya enviaste ${formatNumber(usage.messagesUsed)} mensajes este mes y ${plan.name} incluye ${formatNumber(plan.messagesIncluded)}.`,
    )
  }

  return warnings
}

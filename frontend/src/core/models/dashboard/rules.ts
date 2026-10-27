import type { Dashboard } from "./response"

/** Variación en % contra el período anterior, o `null` si no hay con qué comparar. */
export function changePercent(current: number, previous: number) {
  if (previous === 0) return null

  return Math.round(((current - previous) / previous) * 100)
}

export function averageTicket(sales: Dashboard["sales"]) {
  return sales.orders === 0 ? 0 : Math.round(sales.revenue / sales.orders)
}

/** El vendedor con más ventas del período, o `undefined` si nadie vendió. */
export function topSeller(sellers: Dashboard["sellers"]) {
  return sellers.reduce<Dashboard["sellers"][number] | undefined>(
    (top, seller) => (seller.revenue > (top?.revenue ?? 0) ? seller : top),
    undefined,
  )
}

export function totalMessages(channel: Dashboard["channels"][number]) {
  return channel.botMessages + channel.humanMessages
}

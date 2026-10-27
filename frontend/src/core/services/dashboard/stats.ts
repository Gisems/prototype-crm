import { type Dashboard, type DashboardPeriod, dashboardSchema } from "core/models/dashboard"

/**
 * MOCK: las métricas del prototipo (`docs/prototype`). El mes es la base y la semana y el día se derivan con un
 * factor; las series son a mano para que cada período se vea distinto. Cuando exista el backend, `get` pasa a
 * `crmClient` con su `decode` (el período va como query param) y los hooks y las pantallas no cambian.
 */
const SCALE: Record<DashboardPeriod, number> = { today: 0.04, week: 0.25, month: 1 }

/** Cuánto más (o menos) se vendió contra el período anterior: `previous = actual / ratio`. */
const PREVIOUS_RATIO: Record<DashboardPeriod, number> = { today: 1.18, week: 0.93, month: 0.88 }

const SERIES: Record<DashboardPeriod, Dashboard["revenueSeries"]> = {
  today: [
    { label: "9 h", revenue: 4000 },
    { label: "12 h", revenue: 9000 },
    { label: "15 h", revenue: 6000 },
    { label: "18 h", revenue: 11000 },
    { label: "21 h", revenue: 3000 },
  ],
  week: [
    { label: "Lun", revenue: 24000 },
    { label: "Mar", revenue: 31000 },
    { label: "Mié", revenue: 28000 },
    { label: "Jue", revenue: 35000 },
    { label: "Vie", revenue: 41000 },
    { label: "Sáb", revenue: 33000 },
    { label: "Dom", revenue: 17000 },
  ],
  month: [
    { label: "Sem 1", revenue: 180000 },
    { label: "Sem 2", revenue: 215000 },
    { label: "Sem 3", revenue: 198000 },
    { label: "Sem 4", revenue: 244000 },
  ],
}

/** Los totales del mes; cada período los escala. */
const MONTH = {
  ordersByStatus: [
    { status: "pending", count: 14 },
    { status: "paid", count: 27 },
    { status: "delivered", count: 54 },
    { status: "cancelled", count: 6 },
  ],
  sellers: [
    { id: 1, name: "Julia Méndez", orders: 38, revenue: 400000 },
    { id: 2, name: "Bruno Acosta", orders: 31, revenue: 330000 },
    { id: 3, name: "Sofía Ramos", orders: 12, revenue: 107000 },
  ],
  channels: [
    { channel: "wa", conversations: 312, botMessages: 3010, humanMessages: 1810, orders: 58, revenue: 590000 },
    { channel: "ig", conversations: 148, botMessages: 700, humanMessages: 1230, orders: 19, revenue: 205000 },
    { channel: "fb", conversations: 30, botMessages: 90, humanMessages: 150, orders: 4, revenue: 42000 },
  ],
  agents: [
    { id: 1, name: "Julia Méndez", chats: 164, avgResponseMinutes: 3.2 },
    { id: 2, name: "Bruno Acosta", chats: 139, avgResponseMinutes: 4.8 },
    { id: 3, name: "Sofía Ramos", chats: 71, avgResponseMinutes: 7.5 },
  ],
} as const satisfies Pick<Dashboard, "ordersByStatus" | "sellers" | "channels" | "agents">

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function build(period: DashboardPeriod) {
  const scale = SCALE[period]
  const scaled = (value: number) => Math.round(value * scale)
  const ordersByStatus = MONTH.ordersByStatus.map(({ status, count }) => ({ status, count: scaled(count) }))
  const closedOrders = ordersByStatus
    .filter(({ status }) => status === "paid" || status === "delivered")
    .reduce((sum, { count }) => sum + count, 0)
  const revenue = SERIES[period].reduce((sum, point) => sum + point.revenue, 0)

  return {
    period,
    sales: {
      revenue,
      orders: closedOrders,
      previousRevenue: Math.round(revenue / PREVIOUS_RATIO[period]),
      previousOrders: Math.round(closedOrders / PREVIOUS_RATIO[period]),
    },
    revenueSeries: SERIES[period],
    ordersByStatus,
    sellers: MONTH.sellers.map((seller) => ({
      ...seller,
      orders: scaled(seller.orders),
      revenue: scaled(seller.revenue),
    })),
    channels: MONTH.channels.map((channel) => ({
      ...channel,
      conversations: scaled(channel.conversations),
      botMessages: scaled(channel.botMessages),
      humanMessages: scaled(channel.humanMessages),
      orders: scaled(channel.orders),
      revenue: scaled(channel.revenue),
    })),
    agents: MONTH.agents.map((agent) => ({ ...agent, chats: scaled(agent.chats) })),
  }
}

export function createDashboardService() {
  return {
    async get(period: DashboardPeriod): Promise<Dashboard> {
      await delay(400)

      return dashboardSchema.parse(build(period))
    },
  }
}

import { z } from "zod"

import { CUSTOMER_CHANNELS } from "core/models/customer"

/** Los períodos que se pueden mirar; la vista les pone nombre. */
export const DASHBOARD_PERIODS = ["today", "week", "month"] as const

/** Los estados de un pedido: solo los pagados y entregados cuentan como venta cerrada. */
const ORDER_STATUSES = ["pending", "paid", "delivered", "cancelled"] as const

export const dashboardSchema = z.object({
  period: z.enum(DASHBOARD_PERIODS),
  sales: z.object({
    /** Ventas cerradas del período, en pesos uruguayos. */
    revenue: z.number(),
    /** Pedidos cerrados (pagados + entregados). */
    orders: z.number().int(),
    /** Lo mismo en el período anterior, para mostrar la variación. */
    previousRevenue: z.number(),
    previousOrders: z.number().int(),
  }),
  /** Ventas a lo largo del período, de la más antigua a la más reciente: horas, días o semanas según el período. */
  revenueSeries: z.array(z.object({ label: z.string(), revenue: z.number() })),
  ordersByStatus: z.array(z.object({ status: z.enum(ORDER_STATUSES), count: z.number().int() })),
  sellers: z.array(
    z.object({
      /** Id del miembro del equipo. */
      id: z.number().int(),
      name: z.string(),
      orders: z.number().int(),
      revenue: z.number(),
    }),
  ),
  channels: z.array(
    z.object({
      channel: z.enum(CUSTOMER_CHANNELS),
      conversations: z.number().int(),
      botMessages: z.number().int(),
      humanMessages: z.number().int(),
      orders: z.number().int(),
      revenue: z.number(),
    }),
  ),
  agents: z.array(
    z.object({
      /** Id del miembro del equipo. */
      id: z.number().int(),
      name: z.string(),
      chats: z.number().int(),
      /** Minutos que tarda en promedio en contestar. */
      avgResponseMinutes: z.number(),
    }),
  ),
})

export type Dashboard = z.infer<typeof dashboardSchema>
export type DashboardPeriod = (typeof DASHBOARD_PERIODS)[number]
export type OrderStatus = (typeof ORDER_STATUSES)[number]

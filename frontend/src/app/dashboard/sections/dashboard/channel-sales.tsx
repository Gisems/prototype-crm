import type { Dashboard } from "core/models/dashboard"
import { formatMoney } from "shared/utils/currency"

import { CHANNEL_COLORS, CHANNEL_LABELS } from "./dashboard-visuals"

interface ChannelSalesProps {
  channels: Dashboard["channels"]
}

export function ChannelSales({ channels }: Readonly<ChannelSalesProps>) {
  const total = channels.reduce((sum, channel) => sum + channel.revenue, 0)

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-base font-bold">Ventas por canal</h2>

      {/* Decorativa: el reparto ya está escrito en la lista de abajo. */}
      <div aria-hidden="true" className="flex h-3 overflow-hidden rounded-full bg-muted">
        {channels.map((channel) => (
          <div
            key={channel.channel}
            style={{
              width: `${total === 0 ? 0 : (channel.revenue / total) * 100}%`,
              backgroundColor: CHANNEL_COLORS[channel.channel],
            }}
          />
        ))}
      </div>

      <ul className="flex flex-col divide-y">
        {channels.map((channel) => (
          <li key={channel.channel} className="flex items-center gap-3 py-2.5 text-sm">
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: CHANNEL_COLORS[channel.channel] }}
            />
            <span className="flex-1 font-medium">{CHANNEL_LABELS[channel.channel]}</span>
            <span className="text-xs text-muted-foreground">{channel.orders} pedidos</span>
            <span className="w-28 text-right font-semibold">{formatMoney(channel.revenue, "UYU")}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

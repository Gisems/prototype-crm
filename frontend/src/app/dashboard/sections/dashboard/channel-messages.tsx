import { type Dashboard, totalMessages } from "core/models/dashboard"
import { formatNumber } from "shared/utils/number"

import { CHANNEL_COLORS, CHANNEL_LABELS } from "./dashboard-visuals"

interface ChannelMessagesProps {
  channels: Dashboard["channels"]
}

export function ChannelMessages({ channels }: Readonly<ChannelMessagesProps>) {
  const max = Math.max(1, ...channels.map(totalMessages))

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-base font-bold">Mensajes por canal</h2>

      <ul className="flex flex-col gap-4">
        {channels.map((channel) => (
          <li key={channel.channel}>
            <div className="mb-1.5 flex justify-between gap-3 text-sm">
              <span className="font-medium">{CHANNEL_LABELS[channel.channel]}</span>
              <span className="text-right text-muted-foreground">
                {formatNumber(totalMessages(channel))} mensajes · {formatNumber(channel.conversations)} conversaciones
              </span>
            </div>
            <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(totalMessages(channel) / max) * 100}%`,
                  backgroundColor: CHANNEL_COLORS[channel.channel],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

import type { Dashboard } from "core/models/dashboard"
import { formatNumber } from "shared/utils/number"

interface BotHumanSplitProps {
  channels: Dashboard["channels"]
}

export function BotHumanSplit({ channels }: Readonly<BotHumanSplitProps>) {
  const bot = channels.reduce((sum, channel) => sum + channel.botMessages, 0)
  const human = channels.reduce((sum, channel) => sum + channel.humanMessages, 0)
  const total = bot + human
  const botPercent = total === 0 ? 0 : Math.round((bot / total) * 100)

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-base font-bold">Bot vs. humano</h2>

      <div className="flex items-center gap-5">
        {/* Decorativo: los números están escritos al lado. */}
        <div
          aria-hidden="true"
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: `conic-gradient(var(--accent) ${botPercent}%, var(--primary) 0)` }}
        >
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-card font-display text-lg font-bold">
            {botPercent}%
          </div>
        </div>

        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full bg-accent" />
            Bot: {formatNumber(bot)} mensajes
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full bg-primary" />
            Humano: {formatNumber(human)} mensajes
          </li>
        </ul>
      </div>
    </section>
  )
}

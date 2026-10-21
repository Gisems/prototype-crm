import { Camera, MessageCircle, MessageSquare } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { Channel } from "core/models/channel"
import type { Flow } from "core/models/flow"
import { Button } from "shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"
import { Switch } from "shared/components/ui/switch"

/** Valor del selector para "sin flujo asignado". */
const NO_FLOW = "none"

// Cada canal con el color de su marca; un canal desconocido cae al genérico.
const CHANNEL_VISUALS: Record<string, { icon: LucideIcon; className: string }> = {
  wa: { icon: MessageCircle, className: "bg-[#25d366]/15 text-[#128c7e]" },
  ig: { icon: Camera, className: "bg-[#e1306c]/15 text-[#c13584]" },
  fb: { icon: MessageSquare, className: "bg-[#0866ff]/15 text-[#0866ff]" },
}

const FALLBACK_VISUAL = { icon: MessageCircle, className: "bg-muted text-muted-foreground" }

interface ChannelCardProps {
  channel: Channel
  /** Los flujos que se pueden asignar (los publicados). */
  flows: Flow[]
  /** Este canal tiene un cambio en curso: se deshabilita para no cruzar dos pedidos. */
  isUpdating: boolean
  onToggleBot: (enabled: boolean) => void
  onAssignFlow: (flowId: string | null) => void
  onToggleConnection: () => void
}

export function ChannelCard({
  channel,
  flows,
  isUpdating,
  onToggleBot,
  onAssignFlow,
  onToggleConnection,
}: Readonly<ChannelCardProps>) {
  const { icon: Icon, className } = CHANNEL_VISUALS[channel.id] ?? FALLBACK_VISUAL
  const flowItems = { [NO_FLOW]: "Sin flujo", ...Object.fromEntries(flows.map((flow) => [flow.id, flow.name])) }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${className}`}>
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold">{channel.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{channel.detail}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            channel.connected ? "bg-success/15 text-success" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {channel.connected ? "Conectado" : "No conectado"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-4 text-sm">
        <span>Bot automático</span>
        <Switch
          checked={channel.botEnabled}
          disabled={!channel.connected || isUpdating}
          aria-label={`Bot automático de ${channel.name}`}
          onCheckedChange={onToggleBot}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span>Flujo asignado</span>
        <Select
          value={channel.flowId ?? NO_FLOW}
          items={flowItems}
          disabled={!channel.connected || !channel.botEnabled || isUpdating}
          onValueChange={(next) => onAssignFlow(next === NO_FLOW ? null : next)}
        >
          <SelectTrigger className="w-56" aria-label={`Flujo asignado a ${channel.name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_FLOW}>Sin flujo</SelectItem>
            {flows.map((flow) => (
              <SelectItem key={flow.id} value={flow.id}>
                {flow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="button" variant="outline" disabled={isUpdating} className="self-end" onClick={onToggleConnection}>
        {channel.connected ? "Desconectar" : "Conectar"}
      </Button>
    </article>
  )
}

import type { Dashboard } from "core/models/dashboard"
import { initials } from "shared/utils/string"

interface AgentsTableProps {
  agents: Dashboard["agents"]
}

export function AgentsTable({ agents }: Readonly<AgentsTableProps>) {
  const ranking = agents.toSorted((a, b) => b.chats - a.chats)

  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-base font-bold">Actividad de agentes</h2>

      <ul className="flex flex-col divide-y">
        {ranking.map((agent) => (
          <li key={agent.id} className="flex items-center gap-3 py-3">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {initials(agent.name)}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{agent.name}</span>
            <span className="text-sm">{agent.chats} chats</span>
            <span className="w-32 text-right text-xs text-muted-foreground">
              responde en {agent.avgResponseMinutes.toLocaleString("es-UY")} min
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

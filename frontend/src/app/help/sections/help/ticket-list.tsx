import { Send } from "lucide-react"

import type { Ticket } from "core/models/support"
import { Skeleton } from "shared/components/ui/skeleton"
import { formatDate } from "shared/utils/date"

interface TicketListProps {
  tickets: Ticket[] | undefined
  isPending: boolean
}

export function TicketList({ tickets, isPending }: Readonly<TicketListProps>) {
  if (isPending) return <Skeleton className="h-16 rounded-xl" />

  // Sin consultas no se muestra nada: el título "recientes" sobre una lista vacía confunde.
  if (!tickets?.length) return null

  return (
    <section aria-label="Tus consultas recientes" className="flex flex-col gap-3 border-t pt-5">
      <h3 className="text-sm font-semibold">Tus consultas recientes</h3>
      <ul className="flex flex-col gap-2">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
              <Send className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{ticket.subject}</p>
              <p className="truncate text-xs text-muted-foreground">
                {formatDate(ticket.createdAt)} · {ticket.message}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              Enviada
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

import { ArrowRight } from "lucide-react"

import type { UsageMonth } from "core/models/billing"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"
import { formatMonthShort } from "shared/utils/date"
import { formatNumber } from "shared/utils/number"

import { UsageBar } from "./usage-bar"

interface MessagesUsageProps {
  used: number
  included: number
  /** De más antiguo a más reciente; el último es el mes en curso. */
  history: UsageMonth[] | undefined
  isPending: boolean
}

export function MessagesUsage({ used, included, history, isPending }: Readonly<MessagesUsageProps>) {
  // La escala llega al tope del plan, para que se vea cuánto margen queda en cada mes.
  const chartMax = Math.max(included, ...(history ?? []).map((month) => month.messagesSent))

  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-base font-bold">Mensajes enviados</h2>

      <UsageBar label="Este mes" used={used} included={included} />

      {isPending && <Skeleton className="h-24 rounded-lg" />}

      {history && (
        <ol aria-label="Mensajes enviados por mes" className="flex h-24 items-end gap-2">
          {history.map((month, index) => {
            const isCurrent = index === history.length - 1

            return (
              <li key={month.month} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-muted-foreground">{formatNumber(month.messagesSent)}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    aria-hidden="true"
                    className={`w-full rounded-t ${isCurrent ? "bg-primary" : "bg-primary/35"}`}
                    style={{ height: `${Math.round((month.messagesSent / chartMax) * 100)}%` }}
                  />
                </div>
                <span className={`text-[11px] ${isCurrent ? "font-semibold" : "text-muted-foreground"}`}>
                  {formatMonthShort(month.month)}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      {/* El histórico de mensajes todavía no existe: el botón queda listo para enlazarlo. */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        title="Disponible cuando esté el histórico de mensajes"
        className="self-start"
      >
        Ver histórico de mensajes <ArrowRight />
      </Button>
    </section>
  )
}

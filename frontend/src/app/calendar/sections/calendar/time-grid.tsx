import { format, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect, useRef } from "react"

import { type CalendarEvent, toIsoDate } from "core/models/event"

import { EVENT_CLASSES, EVENT_LABELS } from "./event-visuals"
import { HOUR_HEIGHT, HOURS, placeEvents } from "./time-layout"

/** La hora a la que arranca la grilla al abrirla: la jornada, no la madrugada. */
const FIRST_VISIBLE_HOUR = 8

interface TimeGridProps {
  /** Un día (vista del día) o siete (vista de la semana). */
  days: Date[]
  eventsByDate: ReadonlyMap<string, CalendarEvent[]>
  /** El nombre de cada cliente por id, para mostrar con quién es el evento. */
  customerNames: ReadonlyMap<number, string>
  onOpenDay: (day: Date) => void
  onEditEvent: (event: CalendarEvent) => void
}

export function TimeGrid({ days, eventsByDate, customerNames, onOpenDay, onEditEvent }: Readonly<TimeGridProps>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const columns = `3.5rem repeat(${days.length}, minmax(0, 1fr))`
  const isWeek = days.length > 1

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: FIRST_VISIBLE_HOUR * HOUR_HEIGHT })
  }, [])

  return (
    <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
      <div className={isWeek ? "min-w-[44rem]" : undefined}>
        <div className="grid border-b bg-muted" style={{ gridTemplateColumns: columns }}>
          <div />
          {days.map((day) => (
            <div key={toIsoDate(day)} className="flex flex-col items-center gap-0.5 py-2 text-xs">
              <span className="font-semibold text-muted-foreground uppercase">
                {format(day, "EEE", { locale: es }).replace(".", "")}
              </span>
              <button
                type="button"
                disabled={!isWeek}
                aria-label={`Ver ${format(day, "EEEE d 'de' MMMM", { locale: es })}`}
                onClick={() => onOpenDay(day)}
                className={`flex size-8 items-center justify-center rounded-full text-base transition-colors enabled:hover:bg-card ${
                  isToday(day) ? "bg-accent font-semibold text-accent-foreground" : ""
                }`}
              >
                {format(day, "d")}
              </button>
            </div>
          ))}
        </div>

        <div ref={scrollRef} className="h-[calc(100vh-22rem)] min-h-96 overflow-y-auto">
          <div className="grid" style={{ gridTemplateColumns: columns }}>
            <div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="pr-2 text-right text-xs text-muted-foreground"
                  style={{ height: HOUR_HEIGHT }}
                >
                  {hour === 0 ? "" : `${String(hour).padStart(2, "0")}:00`}
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div key={toIsoDate(day)} className="relative border-l">
                {HOURS.map((hour) => (
                  <div key={hour} className="border-t" style={{ height: HOUR_HEIGHT }} />
                ))}

                {placeEvents(eventsByDate.get(toIsoDate(day)) ?? []).map(({ event, top, lane, lanes }) => {
                  const customer = event.customerId === null ? undefined : customerNames.get(event.customerId)

                  return (
                    <button
                      key={event.id}
                      type="button"
                      title={`${event.time} · ${EVENT_LABELS[event.type]}: ${event.title}`}
                      onClick={() => onEditEvent(event)}
                      className={`absolute overflow-hidden rounded border-l-4 px-1.5 py-1 text-left text-xs hover:brightness-95 ${EVENT_CLASSES[event.type]}`}
                      style={{
                        top: top + 1,
                        height: HOUR_HEIGHT - 2,
                        left: `calc(${(lane / lanes) * 100}% + 2px)`,
                        width: `calc(${100 / lanes}% - 4px)`,
                      }}
                    >
                      <span className="block truncate">
                        <span className="font-semibold">{event.time}</span> {event.title}
                      </span>
                      {customer && <span className="block truncate text-muted-foreground">{customer}</span>}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

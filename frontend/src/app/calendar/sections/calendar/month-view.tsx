import { format, isSameMonth, isToday } from "date-fns"
import { es } from "date-fns/locale"

import { type CalendarEvent, toIsoDate } from "core/models/event"

import { WEEKDAY_LABELS } from "./calendar-view"
import { EVENT_CLASSES, EVENT_DOT_CLASSES, EVENT_LABELS } from "./event-visuals"

/** Cuántos eventos se listan por día; el resto se ve en la vista del día. */
const MAX_EVENTS_PER_DAY = 3

interface MonthViewProps {
  /** Todos los días de la grilla, incluidos los de los meses vecinos. */
  days: Date[]
  /** Un día del mes que se mira: los demás se atenúan. */
  anchor: Date
  eventsByDate: ReadonlyMap<string, CalendarEvent[]>
  onOpenDay: (day: Date) => void
  onEditEvent: (event: CalendarEvent) => void
}

export function MonthView({ days, anchor, eventsByDate, onOpenDay, onEditEvent }: Readonly<MonthViewProps>) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid grid-cols-7 border-b bg-muted text-center text-xs font-semibold text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border">
        {days.map((day) => {
          const events = eventsByDate.get(toIsoDate(day)) ?? []
          const inMonth = isSameMonth(day, anchor)

          return (
            <div
              key={toIsoDate(day)}
              className={`flex min-h-16 flex-col gap-1 p-1 sm:min-h-28 sm:p-1.5 ${inMonth ? "bg-card" : "bg-muted"}`}
            >
              <button
                type="button"
                aria-label={`Ver ${format(day, "EEEE d 'de' MMMM", { locale: es })}`}
                onClick={() => onOpenDay(day)}
                className={`flex size-7 items-center justify-center self-start rounded-full text-sm transition-colors ${
                  isToday(day)
                    ? "bg-accent font-semibold text-accent-foreground"
                    : `hover:bg-muted ${inMonth ? "" : "text-muted-foreground"}`
                }`}
              >
                {format(day, "d")}
              </button>

              {/* En pantallas chicas no entra el texto: se marcan los eventos con un punto del color de su tipo. */}
              <div className="flex flex-wrap gap-1 sm:hidden">
                {events.map((event) => (
                  <span
                    key={event.id}
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${EVENT_DOT_CLASSES[event.type]}`}
                  />
                ))}
              </div>

              <ul className="hidden flex-col gap-1 sm:flex">
                {events.slice(0, MAX_EVENTS_PER_DAY).map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      title={`${event.time} · ${EVENT_LABELS[event.type]}: ${event.title}`}
                      onClick={() => onEditEvent(event)}
                      className={`block w-full truncate rounded border-l-4 px-1.5 py-0.5 text-left text-xs hover:brightness-95 ${EVENT_CLASSES[event.type]}`}
                    >
                      <span className="font-semibold">{event.time}</span> {event.title}
                    </button>
                  </li>
                ))}
                {events.length > MAX_EVENTS_PER_DAY && (
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenDay(day)}
                      className="px-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      +{events.length - MAX_EVENTS_PER_DAY} más
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

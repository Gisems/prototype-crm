import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { CALENDAR_VIEWS, type CalendarView } from "core/models/event"
import { SegmentedControl } from "shared/components/custom/segmented-control"
import { Button } from "shared/components/ui/button"

import { VIEW_LABELS } from "./calendar-view"

interface CalendarToolbarProps {
  view: CalendarView
  /** Lo que se está mirando: `Octubre de 2026`. */
  title: string
  onViewChange: (view: CalendarView) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onCreate: () => void
}

const VIEW_OPTIONS = CALENDAR_VIEWS.map((value) => ({ value, label: VIEW_LABELS[value] }))

export function CalendarToolbar({
  view,
  title,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onCreate,
}: Readonly<CalendarToolbarProps>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="action" onClick={onToday}>
          Hoy
        </Button>
        <Button type="button" variant="outline" size="icon" aria-label="Anterior" onClick={onPrevious}>
          <ChevronLeft />
        </Button>
        <Button type="button" variant="outline" size="icon" aria-label="Siguiente" onClick={onNext}>
          <ChevronRight />
        </Button>
        <h2 aria-live="polite" className="ml-1 font-display text-lg font-bold">
          {title}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl label="Vista del calendario" options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
        <Button type="button" variant="accent" onClick={onCreate}>
          <Plus /> Nuevo evento
        </Button>
      </div>
    </div>
  )
}

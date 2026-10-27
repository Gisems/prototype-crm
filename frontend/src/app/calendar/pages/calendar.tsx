import { startOfDay } from "date-fns"
import { useQueryStates } from "nuqs"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useCreateEvent, useRemoveEvent, useUpdateEvent } from "core/hooks/mutation/use-mutation-event"
import { useCustomers } from "core/hooks/query/use-query-contact"
import { useEvents } from "core/hooks/query/use-query-event"
import { useTeamMembers } from "core/hooks/query/use-query-team"
import {
  type CalendarEvent,
  type EventFormValues,
  groupByDate,
  parseIsoDate,
  rangeTitle,
  shiftAnchor,
  toIsoDate,
  toSaveEventDto,
  visibleDays,
} from "core/models/event"
import { ConfirmDialog } from "shared/components/custom/confirm-dialog"
import { Skeleton } from "shared/components/ui/skeleton"

import { CalendarToolbar } from "../sections/calendar/calendar-toolbar"
import { calendarDateParser, calendarViewParser } from "../sections/calendar/calendar-view"
import { EventDialog } from "../sections/calendar/event-dialog"
import { MonthView } from "../sections/calendar/month-view"
import { TimeGrid } from "../sections/calendar/time-grid"

export const handle = {
  title: "Calendario",
  description: "Tus llamadas, reuniones, entregas y recordatorios",
}

export default function CalendarPage() {
  const [{ view, date }, setParams] = useQueryStates({ view: calendarViewParser, date: calendarDateParser })
  // El mismo diálogo agrega y edita: `editingEvent` es cuál se edita, o `null` para agregar.
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)
  const { data: events, isPending, isError } = useEvents()
  const { data: customers } = useCustomers()
  const { data: members } = useTeamMembers()
  const { mutateAsync: createEvent } = useCreateEvent()
  const { mutateAsync: updateEvent } = useUpdateEvent()
  const { mutateAsync: removeEvent, isPending: isRemoving } = useRemoveEvent()

  // Sin `date` (o con uno inválido en la URL) se mira hoy.
  const anchor = (date && parseIsoDate(date)) || startOfDay(new Date())
  const days = visibleDays(view, anchor)
  const eventsByDate = useMemo(() => groupByDate(events ?? []), [events])
  const customerNames = useMemo(
    () => new Map((customers ?? []).map((customer) => [customer.id, customer.name])),
    [customers],
  )

  function goTo(day: Date) {
    void setParams({ date: toIsoDate(day) })
  }

  function openDay(day: Date) {
    void setParams({ view: "day", date: toIsoDate(day) })
  }

  function openDialog(event: CalendarEvent | null) {
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  async function handleSubmit(values: EventFormValues) {
    try {
      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, dto: toSaveEventDto(values) })
        toast.success("Evento actualizado")
      } else {
        await createEvent(toSaveEventDto(values))
        toast.success("Evento agendado")
      }

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleDelete() {
    if (!eventToDelete) return

    try {
      await removeEvent(eventToDelete.id)
      toast.success("Evento eliminado")
      setEventToDelete(null)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <CalendarToolbar
        view={view}
        title={rangeTitle(view, anchor)}
        onViewChange={(next) => void setParams({ view: next })}
        onPrevious={() => goTo(shiftAnchor(view, anchor, -1))}
        onNext={() => goTo(shiftAnchor(view, anchor, 1))}
        onToday={() => void setParams({ date: null })}
        onCreate={() => openDialog(null)}
      />

      {isPending && <Skeleton className="h-[32rem] rounded-2xl" />}
      {isError && <p className="text-sm text-destructive">No pudimos cargar el calendario. Intenta de nuevo.</p>}

      {events && view === "month" && (
        <MonthView
          days={days}
          anchor={anchor}
          eventsByDate={eventsByDate}
          onOpenDay={openDay}
          onEditEvent={openDialog}
        />
      )}

      {events && view !== "month" && (
        <TimeGrid
          days={days}
          eventsByDate={eventsByDate}
          customerNames={customerNames}
          onOpenDay={openDay}
          onEditEvent={openDialog}
        />
      )}

      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={editingEvent}
        defaultDate={toIsoDate(anchor)}
        customers={customers ?? []}
        members={members ?? []}
        onSubmit={handleSubmit}
        onDelete={() => {
          setIsDialogOpen(false)
          setEventToDelete(editingEvent)
        }}
      />

      <ConfirmDialog
        open={eventToDelete !== null}
        onOpenChange={(open) => !open && setEventToDelete(null)}
        title="Eliminar evento"
        description={`¿Eliminar "${eventToDelete?.title ?? ""}" del calendario? No se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        isPending={isRemoving}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

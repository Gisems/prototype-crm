import type { Customer } from "core/models/customer"
import { type CalendarEvent, type EventFormValues, toEventFormInput } from "core/models/event"
import type { TeamMember } from "core/models/team"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { EventForm } from "./event-form"

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** El evento que se edita; `null` para agregar uno nuevo. */
  event: CalendarEvent | null
  /** El día que se está mirando: el de un evento nuevo. */
  defaultDate: string
  customers: Customer[]
  members: TeamMember[]
  onSubmit: (values: EventFormValues) => Promise<boolean>
  onDelete: () => void
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
  customers,
  members,
  onSubmit,
  onDelete,
}: Readonly<EventDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "Editar evento" : "Nuevo evento"}</DialogTitle>
          <DialogDescription>
            {event ? "Cambia los datos de este evento." : "Agenda una llamada, reunión, entrega o recordatorio."}
          </DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura parte de cero. */}
        <EventForm
          initial={event ? toEventFormInput(event) : undefined}
          defaultDate={defaultDate}
          customers={customers}
          members={members}
          submitLabel={event ? "Guardar" : "Agendar"}
          submittingLabel={event ? "Guardando…" : "Agendando…"}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          onDelete={event ? onDelete : undefined}
        />
      </DialogContent>
    </Dialog>
  )
}
